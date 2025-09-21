import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

const Quiz = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simple quiz questions
  const questions = [
    {
      id: 1,
      question: "What type of work environment do you prefer?",
      options: [
        { id: "a", text: "Team collaboration" },
        { id: "b", text: "Independent work" },
        { id: "c", text: "Fast-paced environment" },
        { id: "d", text: "Creative and flexible" }
      ]
    },
    {
      id: 2,
      question: "What motivates you most?",
      options: [
        { id: "a", text: "Solving problems" },
        { id: "b", text: "Helping others" },
        { id: "c", text: "Learning new things" },
        { id: "d", text: "Leading teams" }
      ]
    },
    {
      id: 3,
      question: "What is your ideal work schedule?",
      options: [
        { id: "a", text: "Regular 9-5" },
        { id: "b", text: "Flexible hours" },
        { id: "c", text: "Project deadlines" },
        { id: "d", text: "Part-time work" }
      ]
    },
    {
      id: 4,
      question: "What type of tasks do you enjoy?",
      options: [
        { id: "a", text: "Analytical work" },
        { id: "b", text: "Creative design" },
        { id: "c", text: "Communication" },
        { id: "d", text: "Technical work" }
      ]
    },
    {
      id: 5,
      question: "What is your career goal?",
      options: [
        { id: "a", text: "Become an expert" },
        { id: "b", text: "Lead teams" },
        { id: "c", text: "Start business" },
        { id: "d", text: "Make impact" }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Career Quiz
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Take our quick quiz to discover your career personality and get personalized recommendations.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
                <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="font-medium">{questions.length} Questions</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">3-5 Minutes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Free Results</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={startQuiz}
                className="min-h-[52px] text-lg px-8"
              >
                Start Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-4">
                  <a href="/login" className="text-blue-600 hover:underline">
                    Sign up
                  </a>{" "}
                  for detailed insights and career recommendations
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Completed!
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Thank you for taking the quiz! Your responses have been recorded.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="w-full"
                >
                  Take Quiz Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz questions
  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
              {currentQ.question}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300"
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
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