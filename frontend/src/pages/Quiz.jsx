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
        { id: "d", text: "Creative and flexible" },
      ],
    },
    {
      id: 2,
      question: "What motivates you most?",
      options: [
        { id: "a", text: "Solving problems" },
        { id: "b", text: "Helping others" },
        { id: "c", text: "Learning new things" },
        { id: "d", text: "Leading teams" },
      ],
    },
    {
      id: 3,
      question: "What is your ideal work schedule?",
      options: [
        { id: "a", text: "Regular 9-5" },
        { id: "b", text: "Flexible hours" },
        { id: "c", text: "Project deadlines" },
        { id: "d", text: "Part-time work" },
      ],
    },
    {
      id: 4,
      question: "What type of tasks do you enjoy?",
      options: [
        { id: "a", text: "Analytical work" },
        { id: "b", text: "Creative design" },
        { id: "c", text: "Communication" },
        { id: "d", text: "Technical work" },
      ],
    },
    {
      id: 5,
      question: "What is your career goal?",
      options: [
        { id: "a", text: "Become an expert" },
        { id: "b", text: "Lead teams" },
        { id: "c", text: "Start business" },
        { id: "d", text: "Make impact" },
      ],
    },
  ];

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculatePersonalityType = () => {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      leadership: 0
    };

    // Simple scoring based on answer patterns
    questions.forEach((question, index) => {
      const answer = answers[question.id];
      if (answer) {
        switch (index) {
          case 0: // Work environment
            if (answer === "a") scores.social += 2;
            else if (answer === "b") scores.analytical += 2;
            else if (answer === "c") scores.leadership += 2;
            else if (answer === "d") scores.creative += 2;
            break;
          case 1: // Motivation
            if (answer === "a") scores.analytical += 2;
            else if (answer === "b") scores.social += 2;
            else if (answer === "c") scores.creative += 2;
            else if (answer === "d") scores.leadership += 2;
            break;
          case 2: // Work schedule
            if (answer === "a") scores.analytical += 1;
            else if (answer === "b") scores.creative += 2;
            else if (answer === "c") scores.leadership += 2;
            else if (answer === "d") scores.creative += 1;
            break;
          case 3: // Task preferences
            if (answer === "a") scores.analytical += 2;
            else if (answer === "b") scores.creative += 2;
            else if (answer === "c") scores.social += 2;
            else if (answer === "d") scores.analytical += 1;
            break;
          case 4: // Career goals
            if (answer === "a") scores.analytical += 2;
            else if (answer === "b") scores.leadership += 2;
            else if (answer === "c") scores.leadership += 2;
            else if (answer === "d") scores.social += 2;
            break;
        }
      }
    });

    // Find the highest scoring personality type
    const maxScore = Math.max(...Object.values(scores));
    const personalityType = Object.keys(scores).find(key => scores[key] === maxScore);
    
    return {
      type: personalityType,
      scores,
      maxScore
    };
  };

  const getPersonalityInsights = (personalityType) => {
    const insights = {
      analytical: {
        title: "Analytical Thinker",
        description: "You excel at problem-solving and logical thinking. You prefer structured environments and enjoy working with data and systems.",
        strengths: ["Problem-solving", "Logical reasoning", "Attention to detail", "Data analysis"],
        careerPaths: ["Data Scientist", "Software Engineer", "Research Analyst", "Financial Analyst"],
        workEnvironment: "Structured, data-driven environments with clear objectives",
        color: "blue"
      },
      creative: {
        title: "Creative Innovator",
        description: "You thrive in flexible, innovative environments. You enjoy thinking outside the box and bringing new ideas to life.",
        strengths: ["Innovation", "Design thinking", "Adaptability", "Visual communication"],
        careerPaths: ["Graphic Designer", "Product Manager", "Marketing Specialist", "Content Creator"],
        workEnvironment: "Flexible, creative spaces with room for experimentation",
        color: "purple"
      },
      social: {
        title: "People Connector",
        description: "You excel at building relationships and helping others. You prefer collaborative environments and enjoy making a positive impact.",
        strengths: ["Communication", "Empathy", "Teamwork", "Relationship building"],
        careerPaths: ["Human Resources", "Sales Representative", "Social Worker", "Teacher"],
        workEnvironment: "Collaborative, people-focused environments",
        color: "green"
      },
      leadership: {
        title: "Natural Leader",
        description: "You have strong leadership qualities and enjoy taking charge. You excel at motivating others and driving projects forward.",
        strengths: ["Leadership", "Strategic thinking", "Decision making", "Team motivation"],
        careerPaths: ["Project Manager", "Business Analyst", "Entrepreneur", "Team Lead"],
        workEnvironment: "Dynamic, goal-oriented environments with leadership opportunities",
        color: "orange"
      }
    };

    return insights[personalityType] || insights.analytical;
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
                Take our quick quiz to discover your career personality and get
                personalized recommendations.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
                <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {questions.length} Questions
                    </span>
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
    const personalityResult = calculatePersonalityType();
    const insights = getPersonalityInsights(personalityResult.type);
    
    const getColorClasses = (color) => {
      const colorMap = {
        blue: {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-700",
          accent: "bg-blue-500"
        },
        purple: {
          bg: "bg-purple-100 dark:bg-purple-900/20",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-700",
          accent: "bg-purple-500"
        },
        green: {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-200 dark:border-green-700",
          accent: "bg-green-500"
        },
        orange: {
          bg: "bg-orange-100 dark:bg-orange-900/20",
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-700",
          accent: "bg-orange-500"
        }
      };
      return colorMap[color] || colorMap.blue;
    };

    const colors = getColorClasses(insights.color);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <Card className="p-8 text-center">
              <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Target className={`w-10 h-10 ${colors.text}`} />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Career Personality Analysis
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Based on your responses, here's your personalized career assessment:
              </p>
            </Card>

            {/* Personality Type */}
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
                  {insights.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {insights.description}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Personality Scores
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(personalityResult.scores).map(([type, score]) => (
                    <div key={type} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                          {type}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${colors.accent} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(score / personalityResult.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Strengths */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Key Strengths
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {insights.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className={`${colors.bg} ${colors.border} border rounded-lg p-4 text-center`}
                  >
                    <span className={`font-medium ${colors.text}`}>
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Career Paths */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recommended Career Paths
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {insights.careerPaths.map((career, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {career}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Work Environment */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ideal Work Environment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {insights.workEnvironment}
              </p>
            </Card>

            {/* Action Buttons */}
            <Card className="p-8">
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
                  onClick={() => (window.location.href = "/")}
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
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
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

              <Button onClick={handleNext} disabled={!selectedAnswer}>
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
