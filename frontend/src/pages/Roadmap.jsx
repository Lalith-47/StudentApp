import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  TrendingUp,
  BookOpen,
  Award,
  MapPin,
  ChevronRight,
  Star
} from 'lucide-react'
import { useQuery } from 'react-query'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Input from '../components/UI/Input'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { apiService } from '../utils/api'

const Roadmap = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Mock data for roadmaps
  const mockRoadmaps = [
    {
      _id: '1',
      courseName: 'Computer Science Engineering',
      description: 'Comprehensive roadmap for Computer Science Engineering covering programming, algorithms, and software development.',
      category: 'Engineering',
      duration: '4 years',
      difficulty: 'Advanced',
      marketDemand: {
        current: 'Very High',
        future: 'Booming',
        salaryRange: {
          entry: '₹6-8 LPA',
          mid: '₹12-18 LPA',
          senior: '₹25-50 LPA'
        }
      },
      timeline: [
        {
          phase: 'Foundation (Year 1)',
          duration: '12 months',
          milestones: [
            {
              title: 'Programming Basics',
              description: 'Learn C, C++, Python fundamentals',
              resources: ['Codecademy', 'GeeksforGeeks'],
              completed: false
            },
            {
              title: 'Mathematics',
              description: 'Discrete Mathematics, Calculus, Linear Algebra',
              resources: ['Khan Academy', 'MIT OpenCourseWare'],
              completed: false
            }
          ],
          skills: ['Programming', 'Mathematics', 'Problem Solving']
        },
        {
          phase: 'Core Development (Year 2)',
          duration: '12 months',
          milestones: [
            {
              title: 'Data Structures & Algorithms',
              description: 'Master fundamental algorithms and data structures',
              resources: ['LeetCode', 'Coursera'],
              completed: false
            }
          ],
          skills: ['Algorithms', 'Data Structures', 'System Design']
        }
      ],
      resources: {
        books: ['Introduction to Algorithms', 'Clean Code'],
        onlineCourses: ['CS50', 'Algorithms Specialization'],
        certifications: ['AWS', 'Google Cloud'],
        tools: ['VS Code', 'Git', 'Docker']
      },
      institutions: [
        {
          name: 'IIT Delhi',
          location: 'New Delhi',
          ranking: 1,
          fees: '₹2.5 LPA',
          admissionProcess: 'JEE Advanced'
        }
      ],
      tags: ['programming', 'technology', 'software', 'algorithms']
    },
    {
      _id: '2',
      courseName: 'Data Science & Analytics',
      description: 'Complete guide to becoming a data scientist with hands-on projects and real-world applications.',
      category: 'Technology',
      duration: '2 years',
      difficulty: 'Intermediate',
      marketDemand: {
        current: 'High',
        future: 'Booming',
        salaryRange: {
          entry: '₹8-12 LPA',
          mid: '₹15-25 LPA',
          senior: '₹30-60 LPA'
        }
      },
      timeline: [
        {
          phase: 'Foundation (Months 1-6)',
          duration: '6 months',
          milestones: [
            {
              title: 'Python Programming',
              description: 'Learn Python for data science',
              resources: ['Python.org', 'DataCamp'],
              completed: false
            }
          ],
          skills: ['Python', 'Statistics', 'Mathematics']
        }
      ],
      resources: {
        books: ['Python for Data Analysis', 'The Elements of Statistical Learning'],
        onlineCourses: ['Data Science Specialization', 'Machine Learning Course'],
        certifications: ['Google Data Analytics', 'IBM Data Science'],
        tools: ['Jupyter', 'Pandas', 'Scikit-learn']
      },
      institutions: [
        {
          name: 'IIIT Hyderabad',
          location: 'Hyderabad',
          ranking: 2,
          fees: '₹3 LPA',
          admissionProcess: 'GATE'
        }
      ],
      tags: ['data science', 'machine learning', 'python', 'analytics']
    }
  ]

  const categories = ['All', 'Engineering', 'Technology', 'Medicine', 'Arts', 'Commerce', 'Science']
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filteredRoadmaps = mockRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || roadmap.category === selectedCategory
    const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'All' || roadmap.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 mb-4">{t('roadmap.title')}</h1>
          <p className="text-body max-w-3xl mx-auto">
            {t('roadmap.subtitle')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder={t('roadmap.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="">{t('roadmap.category')}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input"
              >
                <option value="">{t('roadmap.difficulty')}</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="heading-4 mb-2">{roadmap.courseName}</h3>
                    <p className="text-gray-600 text-sm mb-3">{roadmap.description}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-primary">{roadmap.category}</span>
                  <span className="badge-secondary">{roadmap.difficulty}</span>
                  <span className="badge-secondary">{roadmap.duration}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-900">{roadmap.marketDemand.current}</div>
                    <div className="text-xs text-gray-500">Demand</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-900">{roadmap.marketDemand.salaryRange.entry}</div>
                    <div className="text-xs text-gray-500">Starting Salary</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Top Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.timeline[0]?.skills?.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Top Institutions:</h4>
                  <div className="space-y-1">
                    {roadmap.institutions.slice(0, 2).map((institution, instIndex) => (
                      <div key={instIndex} className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{institution.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{institution.location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  {t('roadmap.view')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roadmaps found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Roadmap
