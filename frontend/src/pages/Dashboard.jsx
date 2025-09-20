import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  Building2, 
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { useQuery } from 'react-query'
import Card from '../components/UI/Card'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { apiService } from '../utils/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts'

const Dashboard = () => {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  // Mock data for analytics
  const mockAnalytics = {
    totalUsers: 15420,
    totalQuizAttempts: 28450,
    totalStories: 1250,
    totalColleges: 850,
    monthlyStats: {
      newUsers: 1250,
      quizCompletions: 2100,
      storyViews: 15000,
      collegeSearches: 8500
    },
    popularCourses: [
      { name: 'Computer Science Engineering', searches: 4500 },
      { name: 'Mechanical Engineering', searches: 3200 },
      { name: 'Electronics Engineering', searches: 2800 },
      { name: 'Civil Engineering', searches: 2100 },
      { name: 'Data Science', searches: 1800 }
    ],
    topColleges: [
      { name: 'IIT Delhi', views: 8500 },
      { name: 'IIT Bombay', views: 7800 },
      { name: 'IIT Madras', views: 7200 },
      { name: 'NIT Trichy', views: 6500 },
      { name: 'IIIT Hyderabad', views: 5800 }
    ],
    userEngagement: [
      { month: 'Jan', users: 1200, sessions: 2400 },
      { month: 'Feb', users: 1350, sessions: 2700 },
      { month: 'Mar', users: 1500, sessions: 3000 },
      { month: 'Apr', users: 1650, sessions: 3300 },
      { month: 'May', users: 1800, sessions: 3600 },
      { month: 'Jun', users: 1950, sessions: 3900 }
    ],
    categoryDistribution: [
      { name: 'Engineering', value: 45, color: '#3b82f6' },
      { name: 'Technology', value: 25, color: '#10b981' },
      { name: 'Medicine', value: 15, color: '#f59e0b' },
      { name: 'Arts', value: 10, color: '#8b5cf6' },
      { name: 'Commerce', value: 5, color: '#ef4444' }
    ]
  }

  const stats = [
    {
      title: t('dashboard.totalUsers'),
      value: mockAnalytics.totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: t('dashboard.quizAttempts'),
      value: mockAnalytics.totalQuizAttempts.toLocaleString(),
      change: '+8.3%',
      changeType: 'positive',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: t('dashboard.stories'),
      value: mockAnalytics.totalStories.toLocaleString(),
      change: '+15.2%',
      changeType: 'positive',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: t('dashboard.colleges'),
      value: mockAnalytics.totalColleges.toLocaleString(),
      change: '+5.7%',
      changeType: 'positive',
      icon: <Building2 className="w-6 h-6" />,
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const monthlyStats = [
    {
      title: 'New Users',
      value: mockAnalytics.monthlyStats.newUsers.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Quiz Completions',
      value: mockAnalytics.monthlyStats.quizCompletions.toLocaleString(),
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Story Views',
      value: mockAnalytics.monthlyStats.storyViews.toLocaleString(),
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'College Searches',
      value: mockAnalytics.monthlyStats.collegeSearches.toLocaleString(),
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-2 mb-2">{t('dashboard.title')}</h1>
              <p className="text-body">{t('dashboard.subtitle')}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Monthly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <h3 className="heading-4 mb-6">Monthly Activity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {monthlyStats.map((stat, index) => (
                <div key={stat.title} className="text-center">
                  <div className={`w-10 h-10 ${stat.color} bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Engagement Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="heading-4 mb-6">User Engagement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={mockAnalytics.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <h3 className="heading-4 mb-6">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={mockAnalytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockAnalytics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Popular Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <h3 className="heading-4 mb-6">Popular Courses</h3>
              <div className="space-y-4">
                {mockAnalytics.popularCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{course.searches.toLocaleString()} searches</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Colleges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <h3 className="heading-4 mb-6">Top Colleges</h3>
              <div className="space-y-4">
                {mockAnalytics.topColleges.map((college, index) => (
                  <div key={college.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{college.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{college.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
