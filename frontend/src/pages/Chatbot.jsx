import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle,
  Loader2
} from 'lucide-react'
import { useMutation } from 'react-query'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Input from '../components/UI/Input'
import { apiService } from '../utils/api'
import toast from 'react-hot-toast'

const Chatbot = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your career guidance assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const suggestedQuestions = [
    'What are the best engineering colleges in India?',
    'How to prepare for JEE Advanced?',
    'What career options are available after B.Tech?',
    'How to choose the right specialization?',
    'What are the job prospects in data science?',
    'How to improve my chances of getting placed?'
  ]

  const submitQueryMutation = useMutation(apiService.submitFaqQuery, {
    onSuccess: (data) => {
      setIsTyping(false)
      const botResponse = {
        id: Date.now(),
        type: 'bot',
        content: data.data.answer,
        timestamp: new Date(),
        helpful: data.data.found,
        relatedQuestions: data.data.relatedQuestions || []
      }
      setMessages(prev => [...prev, botResponse])
    },
    onError: (error) => {
      setIsTyping(false)
      const errorResponse = {
        id: Date.now(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        timestamp: new Date(),
        helpful: false
      }
      setMessages(prev => [...prev, errorResponse])
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      submitQueryMutation.mutate({ query: inputMessage })
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question)
    inputRef.current?.focus()
  }

  const handleFeedback = (messageId, isHelpful) => {
    // In a real app, you would send this feedback to the backend
    toast.success(`Thank you for your feedback!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="heading-2 mb-4">{t('chatbot.title')}</h1>
          <p className="text-body max-w-2xl mx-auto">
            {t('chatbot.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            
                            {/* Feedback for bot messages */}
                            {message.type === 'bot' && message.helpful !== undefined && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">{t('chatbot.helpful')}</p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleFeedback(message.id, true)}
                                    className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-700"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{t('chatbot.yes')}</span>
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(message.id, false)}
                                    className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                    <span>{t('chatbot.no')}</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Related Questions */}
                            {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">Related Questions:</p>
                                <div className="space-y-1">
                                  {message.relatedQuestions.map((relatedQ, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestedQuestion(relatedQ.question)}
                                      className="block text-xs text-primary-600 hover:text-primary-700 text-left"
                                    >
                                      {relatedQ.question}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center space-x-1">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-600">{t('chatbot.thinking')}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('chatbot.placeholder')}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <h3 className="heading-4 mb-4">{t('chatbot.suggestions')}</h3>
                <div className="space-y-3">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="mt-6">
                <h3 className="heading-4 mb-4">Quick Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Be specific with your questions for better answers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Ask about career paths, colleges, or preparation tips</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Rate responses to help improve the chatbot</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
