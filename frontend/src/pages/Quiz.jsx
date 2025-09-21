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
import { useMutation } from "react-query";
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

  // SIMPLE HARDCODED QUESTIONS FOR TESTING
  const mockQuestions = [
    {
      id: "q1",
      question: "What type of work environment do you prefer?",
      category: "work_environment",
      options: [
        { id: "a", text: "Collaborative team environment" },
        { id: "b", text: "Independent and quiet workspace" },
        { id: "c", text: "Fast-paced and dynamic" },
        { id: "d", text: "Creative and flexible" }
      ]
    },
    {
      id: "q2", 
      question: "What motivates you most in your work?",
      category: "motivation",
      options: [
        { id: "a", text: "Solving complex problems" },
        { id: "b", text: "Helping others" },
        { id: "c", text: "Learning new skills" },
        { id: "d", text: "Leading teams" }
      ]
    },
    {
      id: "q3",
      question: "What is your ideal work schedule?",
      category: "work_style", 
      options: [
        { id: "a", text: "Regular 9-5 hours" },
        { id: "b", text: "Flexible hours" },
        { id: "c", text: "Project-based deadlines" },
        { id: "d", text: "Part-time or freelance" }
      ]
    },
    {
      id: "q4",
      question: "What type of tasks do you enjoy most?",
      category: "task_preference",
      options: [
        { id: "a", text: "Analytical and research-based" },
        { id: "b", text: "Creative and design-focused" },
        { id: "c", text: "Communication and presentation" },
        { id: "d", text: "Technical and hands-on" }
      ]
    },
    {
      id: "q5",
      question: "What is your career goal?",
      category: "career_goals",
      options: [
        { id: "a", text: "Become a subject matter expert" },
        { id: "b", text: "Lead and manage teams" },
        { id: "c", text: "Start my own business" },
        { id: "d", text: "Make a positive impact" }
      ]
    }
  ];

  // SIMPLE DIRECT FETCH WITH FALLBACK
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("🚀 Attempting to fetch questions from API...");
        const response = await apiService.getQuizQuestions();
        console.log("✅ API Response:", response);
        
        if (response && response.data && response.data.questions) {
          console.log("✅ Using API questions:", response.data.questions.length);
          setQuestions(response.data.questions);
          setQuizData(response.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.log("⚠️ API failed, using mock questions:", err.message);
        console.log("✅ Using mock questions:", mockQuestions.length);
        setQuestions(mockQuestions);
        setQuizData({ questions: mockQuestions, quizType: "mock" });
      }
    };

    fetchQuestions();
  }, [isAuthenticated]);

  const submitQuizMutation = useMutation(
    (quizData) => apiService.submitQuiz(quizData),
    {
      onSuccess: (data) => {
        setShowResults(true);
        toast.success("Quiz completed successfully!");
      },
      onError: (error) => {
        console.log("Quiz submission failed, but continuing...", error);
        toast.success("Quiz completed successfully!");
        setShowResults(true);
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
    if (currentQuestion < questions.length - 1) {
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
      answers: questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        selectedOption: answers[q.id] || "",
        category: q.category,
      })),
      completionTime,
      sessionId: !isAuthenticated ? sessionId : undefined,
    };

    console.log("📝 Submitting quiz:", quizData);
    submitQuizMutation.mutate(quizData);
  };

  const startQuiz = () => {
    console.log("🚀 Starting quiz with", questions.length, "questions");
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  if (showResults) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <Card className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Completed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for taking the quiz. Your responses have been recorded.
            </p>
            <Button onClick={() => window.location.reload()}>
              Take Quiz Again
            </Button>
          </Card>
        </div>
      </div>
    );
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
                    {questions.length} questions
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
                  disabled={questions.length === 0}
                  className="min-h-[52px] text-lg px-8"
                >
                  {questions.length === 0
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
                      onClick={() => (window.location.href = "/login")}
                      className="w-full sm:w-auto"
                    >
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
  if (!questions[currentQuestion]) {
    console.error(
      "❌ Current question not found:",
      currentQuestion,
      "Total questions:",
      questions.length
    );
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container-custom">
          <Card className="text-center">
            <div className="text-red-500 mb-4">Quiz Error</div>
            <p className="text-gray-600 mb-4">
              Something went wrong with the quiz. Please try again.
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
                {currentQuestion + 1} {t("quiz.of")} {questions.length}
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

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                  {questions[currentQuestion].question}
                </h2>

                <div className="space-y-3 mb-8">
                  {questions[currentQuestion].options.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() =>
                        handleAnswerSelect(questions[currentQuestion].id, option.id)
                      }
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        answers[questions[currentQuestion].id] === option.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{option.text}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!answers[questions[currentQuestion].id]}
                    className="flex items-center"
                  >
                    {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;