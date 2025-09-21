import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Loader2,
  Settings,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react";
import { useMutation, useQuery } from "react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import { apiService } from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Chatbot = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your career guidance assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAIProvider, setSelectedAIProvider] = useState("gemini");
  const [useAI, setUseAI] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedQuestions = [
    "What are the best engineering colleges in India?",
    "How to prepare for JEE Advanced?",
    "What career options are available after B.Tech?",
    "How to choose the right specialization?",
    "What are the job prospects in data science?",
    "How to improve my chances of getting placed?",
  ];

  // Fetch AI providers
  const { data: aiProvidersData, isLoading: aiProvidersLoading } = useQuery(
    "aiProviders",
    apiService.getAIProviders,
    {
      onSuccess: (data) => {
        if (data.data.best) {
          setSelectedAIProvider(data.data.best);
        }
      },
    }
  );

  const submitQueryMutation = useMutation(apiService.submitFaqQuery, {
    onSuccess: (response) => {
      setIsTyping(false);

      // Check if we have the expected response structure
      if (response?.data?.success && response?.data?.data?.answer) {
        const botResponse = {
          id: Date.now(),
          type: "bot",
          content: response.data.data.answer,
          timestamp: new Date(),
          helpful: response.data.data.found || false,
          relatedQuestions: response.data.data.relatedQuestions || [],
          aiProvider: response.data.data.aiProvider || "AdhyayanMarg Assistant",
          aiModel: response.data.data.aiModel || "Enhanced Knowledge Base",
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errorResponse = {
          id: Date.now(),
          type: "bot",
          content:
            "I apologize, but I couldn't generate a response. Please try again.",
          timestamp: new Date(),
          helpful: false,
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    },
    onError: (error) => {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      const errorResponse = {
        id: Date.now(),
        type: "bot",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
        helpful: false,
      };
      setMessages((prev) => [...prev, errorResponse]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Prepare query data with AI settings
    const queryData = {
      query: inputMessage,
      useAI: useAI,
      aiProvider:
        selectedAIProvider === "auto" ? undefined : selectedAIProvider,
    };

    // Update analytics for AI interaction
    if (user) {
      apiService.updateUserAnalytics({
        field: "totalInteractions",
        increment: 1,
      });
    }

    // Simulate typing delay
    setTimeout(() => {
      submitQueryMutation.mutate(queryData);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const handleFeedback = (messageId, isHelpful) => {
    // In a real app, you would send this feedback to the backend
    toast.success(`Thank you for your feedback!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="heading-2">{t("chatbot.title")}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
          <p className="text-body max-w-2xl mx-auto">{t("chatbot.subtitle")}</p>
        </motion.div>

        {/* AI Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Settings
                </h3>

                <div className="space-y-4">
                  {/* Enable/Disable AI */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable AI Assistant
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use AI for more intelligent responses
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* AI Provider Selection */}
                  {useAI && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AI Provider
                      </label>
                      <select
                        value={selectedAIProvider}
                        onChange={(e) => setSelectedAIProvider(e.target.value)}
                        className="input w-full"
                        disabled={aiProvidersLoading}
                      >
                        <option value="gemini">Google Gemini</option>
                      </select>
                      {aiProvidersData?.data?.best && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Currently using:{" "}
                          {
                            aiProvidersData.data.providers[
                              aiProvidersData.data.best
                            ]?.name
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {/* Gemini Status */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI Provider Status:
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Google Gemini - Active
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start space-x-3 max-w-[80%] ${
                            message.type === "user"
                              ? "flex-row-reverse space-x-reverse"
                              : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.type === "user"
                                ? "bg-primary-600 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-4 ${
                              message.type === "user"
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                          >
                            <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => (
                                    <p className="mb-2 last:mb-0">{children}</p>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-inside mb-2 space-y-1">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-inside mb-2 space-y-1">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="text-sm">{children}</li>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-primary-600 dark:text-primary-400">
                                      {children}
                                    </strong>
                                  ),
                                  em: ({ children }) => (
                                    <em className="italic">{children}</em>
                                  ),
                                  code: ({ children }) => (
                                    <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-xs font-mono">
                                      {children}
                                    </code>
                                  ),
                                  blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary-500 pl-4 italic my-2">
                                      {children}
                                    </blockquote>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>

                            {/* AI Provider Info for bot messages */}
                            {message.type === "bot" && message.aiProvider && (
                              <div className="mt-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-primary-500" />
                                <span className="text-xs text-primary-600 dark:text-primary-400">
                                  Powered by {message.aiProvider}
                                  {message.aiModel && ` (${message.aiModel})`}
                                </span>
                              </div>
                            )}

                            <p
                              className={`text-xs mt-2 ${
                                message.type === "user"
                                  ? "text-primary-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>

                            {/* Feedback for bot messages */}
                            {message.type === "bot" &&
                              message.helpful !== undefined && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                    {t("chatbot.helpful")}
                                  </p>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleFeedback(message.id, true)
                                      }
                                      className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-700"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{t("chatbot.yes")}</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleFeedback(message.id, false)
                                      }
                                      className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                      <span>{t("chatbot.no")}</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                            {/* Related Questions */}
                            {message.relatedQuestions &&
                              message.relatedQuestions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                    Related Questions:
                                  </p>
                                  <div className="space-y-1">
                                    {message.relatedQuestions.map(
                                      (relatedQ, index) => (
                                        <button
                                          key={index}
                                          onClick={() =>
                                            handleSuggestedQuestion(
                                              relatedQ.question
                                            )
                                          }
                                          className="block text-xs text-primary-600 hover:text-primary-700 text-left"
                                        >
                                          {relatedQ.question}
                                        </button>
                                      )
                                    )}
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
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-1">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {t("chatbot.thinking")}
                            </span>
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
                      placeholder={t("chatbot.placeholder")}
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
            <div className="lg:col-span-2">
              <Card>
                <h3 className="heading-4 mb-4">{t("chatbot.suggestions")}</h3>
                <div className="space-y-3">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="mt-6">
                <h3 className="heading-4 mb-4">Quick Tips</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>
                      Be specific with your questions for better answers
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>
                      Ask about career paths, colleges, or preparation tips
                    </span>
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
  );
};

export default Chatbot;
