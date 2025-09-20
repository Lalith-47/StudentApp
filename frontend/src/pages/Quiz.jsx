import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Target,
  TrendingUp,
  Users,
  BookOpen
} from 'lucide-react'
import { useQuery, useMutation } from 'react-query'
import toast from 'react-hot-toast'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { apiService } from '../utils/api'

const Quiz = () => {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startTime, setStartTime] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  // Dummy quiz questions
  const questions = [
    {
      id: 'q1',
      question: 'What type of work environment do you prefer?',
      category: 'work_environment',
      options: [
        { id: 'a', text: 'Collaborative team environment', score: { social: 3, leadership: 2 } },
        { id: 'b', text: 'Independent and quiet workspace', score: { analytical: 3, technical: 2 } },
        { id: 'c', text: 'Creative and flexible environment', score: { creative: 3, social: 1 } },
        { id: 'd', text: 'Fast-paced and challenging', score: { leadership: 3, analytical: 2 } }
      ]
    },
    {
      id: 'q2',
      question: 'Which activity interests you most?',
      category: 'interests',
      options: [
        { id: 'a', text: 'Solving complex problems', score: { analytical: 3, technical: 2 } },
        { id: 'b', text: 'Creating art or design', score: { creative: 3, social: 1 } },
        { id: 'c', text: 'Helping others', score: { social: 3, leadership: 1 } },
        { id: 'd', text: 'Leading a team', score: { leadership: 3, social: 2 } }
      ]
    },
    {
      id: 'q3',
      question: 'What motivates you most in your work?',
      category: 'motivation',
      options: [
        { id: 'a', text: 'Making a positive impact', score: { social: 3, leadership: 2 } },
        { id: 'b', text: 'Learning new things', score: { analytical: 3, technical: 2 } },
        { id: 'c', text: 'Expressing creativity', score: { creative: 3, social: 1 } },
        { id: 'd', text: 'Achieving recognition', score: { leadership: 3, analytical: 1 } }
      ]
    },
    {
      id: 'q4',
      question: 'How do you prefer to learn new skills?',
      category: 'learning_style',
      options: [
        { id: 'a', text: 'Hands-on practice', score: { technical: 3, analytical: 2 } },
        { id: 'b', text: 'Visual and creative methods', score: { creative: 3, social: 1 } },
        { id: 'c', text: 'Group discussions', score: { social: 3, leadership: 2 } },
        { id: 'd', text: 'Structured courses', score: { analytical: 3, technical: 1 } }
      ]
    },
    {
      id: 'q5',
      question: 'What type of challenges do you enjoy?',
      category: 'challenges',
      options: [
        { id: 'a', text: 'Technical and logical problems', score: { technical: 3, analytical: 2 } },
        { id: 'b', text: 'Creative and artistic challenges', score: { creative: 3, social: 1 } },
        { id: 'c', text: 'Social and communication challenges', score: { social: 3, leadership: 2 } },
        { id: 'd', text: 'Strategic and planning challenges', score: { leadership: 3, analytical: 2 } }
      ]
    }
  ]

  const submitQuizMutation = useMutation(apiService.submitQuiz, {
    onSuccess: (data) => {
      setShowResults(true)
      toast.success('Quiz submitted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to submit quiz. Please try again.')
    }
  })

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const completionTime = Math.floor((Date.now() - startTime) / 1000)
    const quizData = {
      answers: questions.map(q => ({
        questionId: q.id,
        question: q.question,
        selectedOption: answers[q.id] || '',
        category: q.category
      })),
      completionTime
    }

    submitQuizMutation.mutate(quizData)
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const canProceed = answers[questions[currentQuestion]?.id]

  if (showResults) {
    return <QuizResults />
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
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
                <h1 className="heading-2 mb-4">{t('quiz.title')}</h1>
                <p className="text-body max-w-2xl mx-auto mb-8">
                  {t('quiz.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Takes 5-10 minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">{questions.length} questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Get instant results</span>
                </div>
              </div>

              <Button size="lg" onClick={startQuiz}>
                {t('quiz.start')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
                {t('quiz.progress')}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {currentQuestion + 1} {t('quiz.of')} {questions.length}
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
                    {questions[currentQuestion].question}
                  </h2>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleAnswerSelect(questions[currentQuestion].id, option.id)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          answers[questions[currentQuestion].id] === option.id
                            ? 'border-primary-500 bg-primary-50 text-primary-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            answers[questions[currentQuestion].id] === option.id
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[questions[currentQuestion].id] === option.id && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('quiz.previous')}
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed || submitQuizMutation.isLoading}
                    >
                      {submitQuizMutation.isLoading ? (
                        <LoadingSpinner size="sm" text="" />
                      ) : (
                        t('quiz.submit')
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                    >
                      {t('quiz.next')}
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
  )
}

// Quiz Results Component
const QuizResults = () => {
  const { t } = useTranslation()
  const [results, setResults] = useState(null)

  // Mock results for demonstration
  useEffect(() => {
    const mockResults = {
      personalityType: 'Analyst',
      strengths: ['Problem Solving', 'Critical Thinking', 'Data Analysis', 'Logical Reasoning'],
      areasForImprovement: ['Social Skills', 'Creativity', 'Public Speaking'],
      recommendedCourses: [
        {
          courseName: 'Data Science & Analytics',
          matchPercentage: 95,
          description: 'Perfect for analytical minds who love working with data',
          careerPaths: ['Data Scientist', 'Business Analyst', 'Research Scientist']
        },
        {
          courseName: 'Computer Science Engineering',
          matchPercentage: 88,
          description: 'Strong foundation in programming and algorithms',
          careerPaths: ['Software Engineer', 'System Analyst', 'Technical Architect']
        }
      ]
    }
    setResults(mockResults)
  }, [])

  if (!results) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
            <h1 className="heading-2 mb-4">{t('quiz.results.title')}</h1>
            <p className="text-body">Based on your answers, here are your personalized recommendations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personality Type */}
            <Card>
              <h3 className="heading-4 mb-4">{t('quiz.results.personality')}</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-primary-600 mb-2">
                  {results.personalityType}
                </h4>
                <p className="text-gray-600 text-sm">
                  You have a strong analytical mindset and enjoy solving complex problems
                </p>
              </div>
            </Card>

            {/* Strengths */}
            <Card>
              <h3 className="heading-4 mb-4">{t('quiz.results.strengths')}</h3>
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
              <h3 className="heading-4 mb-4">{t('quiz.results.improvements')}</h3>
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
            <h3 className="heading-4 mb-6">{t('quiz.results.recommendations')}</h3>
            <div className="space-y-6">
              {results.recommendedCourses.map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
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
                    <h5 className="font-medium text-gray-900 mb-2">Career Paths:</h5>
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
            <h3 className="heading-4 mb-4">{t('quiz.results.nextSteps')}</h3>
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
  )
}

export default Quiz
