import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  User,
  LogIn,
} from "lucide-react";
import { useQuery, useMutation } from "react-query";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { apiService } from "../utils/api";

const Quiz = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // SIMPLE DIRECT FETCH - NO REACT QUERY
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("🚀 Direct fetch: Starting...");
        setQuestionsLoading(true);
        setQuestionsError(null);
        
        const response = await apiService.getQuizQuestions();
        console.log("✅ Direct fetch: Response received:", response);
        
        if (response && response.data && response.data.questions) {
          console.log("✅ Direct fetch: Setting questions:", response.data.questions.length);
          setQuestions(response.data.questions);
          setQuizData(response.data);
          setQuestionsLoading(false);
        } else {
          console.error("❌ Direct fetch: Invalid response structure:", response);
          setQuestionsError("Invalid response from server");
          setQuestionsLoading(false);
        }
      } catch (err) {
        console.error("❌ Direct fetch ERROR:", err);
        setQuestionsError(err.message || "Failed to load questions");
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [isAuthenticated]); // Re-fetch when auth status changes

  const submitQuizMutation = useMutation(
    (quizData) => apiService.submitQuiz(quizData),
    {
      onSuccess: (data) => {
        setShowResults(true);
        if (data.isGuestUser) {
          toast.success("Quiz completed! Sign up to get detailed insights!");
        } else {
          toast.success("Quiz submitted successfully!");
        }
      },
      onError: (error) => {
        toast.error("Failed to submit quiz. Please try again.");
      },
    }
  );

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < actualQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    const quizData = {
      answers: actualQuestions.map((q) => ({
        questionId: q.id,
        question: q.question,
        selectedOption: answers[q.id] || "",
        category: q.category,
      })),
      completionTime,
      sessionId: !isAuthenticated ? sessionId : undefined,
    };

    submitQuizMutation.mutate(quizData);
  };

  const startQuiz = () => {
    console.log("🚀 Starting quiz...");
    console.log("🚀 Questions available:", questions.length);
    console.log("🚀 ActualQuestions length:", actualQuestions.length);
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  // Use questions state directly
  const actualQuestions = questions;

  // Debug logging
  console.log("=== QUIZ DEBUG INFO ===");
  console.log("Debug - questions.length:", questions.length);
  console.log("Debug - actualQuestions.length:", actualQuestions.length);
  console.log("Debug - questionsLoading:", questionsLoading);
  console.log("Debug - questionsError:", questionsError);
  console.log("Debug - isAuthenticated:", isAuthenticated);
  console.log("Debug - quizStarted:", quizStarted);
  console.log("==========================");

  const progress =
    actualQuestions.length > 0
      ? ((currentQuestion + 1) / actualQuestions.length) * 100
      : 0;
  const canProceed =
    actualQuestions[currentQuestion] &&
    answers[actualQuestions[currentQuestion]?.id];

  if (showResults) {
    return <QuizResults />;
  }

  if (questionsLoading) {
    return <LoadingSpinner />;
  }

  if (questionsError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <Card className="text-center">
            <div className="text-red-500 mb-4">Error loading quiz</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  // Show quiz start screen if not started
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="heading-2 mb-4">
                  {isAuthenticated
                    ? "Detailed Career Assessment"
                    : "Quick Career Quiz"}
                </h1>
                <p className="text-body max-w-2xl mx-auto mb-6">
                  {isAuthenticated
                    ? "Take our comprehensive career assessment to get detailed insights about your personality, strengths, and career recommendations."
                    : "Take a quick quiz to get a preview of your career personality. Sign up for detailed insights!"}
                </p>

                {/* User Status Indicator */}
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                    isAuthenticated
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Logged in as {user?.name}
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Guest Mode
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">
                    {isAuthenticated
                      ? "Takes 10-15 minutes"
                      : "Takes 3-5 minutes"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">
                    {questions.length > 0
                      ? questions.length
                      : isAuthenticated
                      ? "15"
                      : "5"}{" "}
                    questions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">
                    {isAuthenticated ? "Detailed results" : "Quick preview"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={startQuiz}
                  disabled={actualQuestions.length === 0}
                  className="min-h-[52px] text-lg px-8"
                >
                  {actualQuestions.length === 0
                    ? "Loading Questions..."
                    : isAuthenticated
                    ? "Start Detailed Assessment"
                    : "Start Quick Quiz"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {!isAuthenticated && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Want detailed career insights?
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => (window.location.href = "/login")}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign Up for Free
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Safety check for current question
  if (!actualQuestions[currentQuestion]) {
    console.error(
      "❌ Current question not found:",
      currentQuestion,
      "Total questions:",
      actualQuestions.length
    );
    console.error("❌ ActualQuestions:", actualQuestions);
    console.error("❌ Questions state:", questions);

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <Card className="text-center">
            <div className="text-red-500 mb-4">Quiz Error</div>
            <p className="text-gray-600 mb-4">
              No questions available. Current: {currentQuestion}, Total:{" "}
              {actualQuestions.length}
            </p>
            <Button onClick={() => window.location.reload()}>
              Restart Quiz
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {t("quiz.progress")}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {currentQuestion + 1} {t("quiz.of")} {actualQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <Card>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="heading-3 mb-6">
                    {actualQuestions[currentQuestion]?.question ||
                      "Question not available"}
                  </h2>

                  <div className="space-y-3">
                    {(actualQuestions[currentQuestion]?.options || []).map(
                      (option) => (
                        <motion.button
                          key={option.id}
                          onClick={() =>
                            handleAnswerSelect(
                              actualQuestions[currentQuestion]?.id,
                              option.id
                            )
                          }
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 relative overflow-hidden ${
                            answers[actualQuestions[currentQuestion]?.id] ===
                            option.id
                              ? "border-primary-500 bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-100 text-gray-900 dark:text-gray-100"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            WebkitTapHighlightColor: "transparent",
                            outline: "none",
                          }}
                        >
                          <div className="flex items-center relative z-10">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                answers[
                                  actualQuestions[currentQuestion]?.id
                                ] === option.id
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-gray-300 dark:border-gray-500"
                              }`}
                            >
                              {answers[actualQuestions[currentQuestion]?.id] ===
                                option.id && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-medium text-inherit">
                              {option.text}
                            </span>
                          </div>
                        </motion.button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("quiz.previous")}
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed || submitQuizMutation.isLoading}
                    >
                      {submitQuizMutation.isLoading ? (
                        <LoadingSpinner size="sm" text="" />
                      ) : (
                        t("quiz.submit")
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!canProceed}>
                      {t("quiz.next")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Quiz Results Component
const QuizResults = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState(null);

  // Mock results for demonstration
  useEffect(() => {
    const mockResults = {
      personalityType: "Analyst",
      strengths: [
        "Problem Solving",
        "Critical Thinking",
        "Data Analysis",
        "Logical Reasoning",
      ],
      areasForImprovement: ["Social Skills", "Creativity", "Public Speaking"],
      recommendedCourses: [
        {
          courseName: "Data Science & Analytics",
          matchPercentage: 95,
          description:
            "Perfect for analytical minds who love working with data",
          careerPaths: [
            "Data Scientist",
            "Business Analyst",
            "Research Scientist",
          ],
        },
        {
          courseName: "Computer Science Engineering",
          matchPercentage: 88,
          description: "Strong foundation in programming and algorithms",
          careerPaths: [
            "Software Engineer",
            "System Analyst",
            "Technical Architect",
          ],
        },
      ],
    };
    setResults(mockResults);
  }, []);

  if (!results) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="heading-2 mb-4">{t("quiz.results.title")}</h1>
            <p className="text-body">
              Based on your answers, here are your personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personality Type */}
            <Card>
              <h3 className="heading-4 mb-4">
                {t("quiz.results.personality")}
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-primary-600 mb-2">
                  {results.personalityType}
                </h4>
                <p className="text-gray-600 text-sm">
                  You have a strong analytical mindset and enjoy solving complex
                  problems
                </p>
              </div>
            </Card>

            {/* Strengths */}
            <Card>
              <h3 className="heading-4 mb-4">{t("quiz.results.strengths")}</h3>
              <div className="space-y-2">
                {results.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <h3 className="heading-4 mb-4">
                {t("quiz.results.improvements")}
              </h3>
              <div className="space-y-2">
                {results.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommended Courses */}
          <Card className="mt-8">
            <h3 className="heading-4 mb-6">
              {t("quiz.results.recommendations")}
            </h3>
            <div className="space-y-6">
              {results.recommendedCourses.map((course, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {course.courseName}
                      </h4>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {course.matchPercentage}%
                      </div>
                      <div className="text-sm text-gray-500">Match</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                      Career Paths:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {course.careerPaths.map((path, pathIndex) => (
                        <span
                          key={pathIndex}
                          className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="mt-8">
            <h3 className="heading-4 mb-4">{t("quiz.results.nextSteps")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="w-full">
                Explore Roadmaps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="w-full">
                Find Colleges
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;
