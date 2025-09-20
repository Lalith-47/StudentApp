import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  Star,
  Clock,
  User,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Input from '../components/UI/Input'
import { apiService } from '../utils/api'

const Stories = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)

  // Mock data for stories
  const mockStories = [
    {
      _id: '1',
      title: 'From Small Town to Silicon Valley: My Journey as a Software Engineer',
      author: {
        name: 'Priya Sharma',
        currentRole: 'Senior Software Engineer',
        company: 'Google',
        experience: '5 years',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Growing up in a small town in Rajasthan, I never imagined I would one day work at Google in Silicon Valley. My journey began with a simple dream of becoming a computer engineer...',
      summary: 'A inspiring story of how determination and hard work helped a small-town girl achieve her dreams in the tech industry.',
      category: 'Success Story',
      tags: ['software engineering', 'career growth', 'motivation'],
      course: {
        name: 'Computer Science Engineering',
        college: 'IIT Delhi',
        year: 2018
      },
      careerPath: {
        from: 'Student',
        to: 'Senior Software Engineer',
        timeline: '5 years'
      },
      keyAchievements: [
        'Graduated from IIT Delhi with distinction',
        'Got placed at Google through campus placement',
        'Led multiple high-impact projects',
        'Mentored 20+ junior engineers'
      ],
      challenges: [
        'Language barrier in initial days',
        'Adapting to fast-paced tech environment',
        'Work-life balance in demanding role'
      ],
      advice: [
        'Never give up on your dreams',
        'Continuous learning is key',
        'Build strong professional network',
        'Take calculated risks'
      ],
      readTime: 8,
      likes: 245,
      views: 1250,
      comments: [
        {
          author: 'Rahul Kumar',
          content: 'Very inspiring story! Thank you for sharing.',
          date: new Date(),
          likes: 12
        }
      ],
      isFeatured: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      title: 'How I Switched from Engineering to Data Science',
      author: {
        name: 'Rahul Kumar',
        currentRole: 'Data Scientist',
        company: 'Microsoft',
        experience: '3 years',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      content: 'After completing my mechanical engineering degree, I realized my true passion lay in data and analytics. Here\'s how I made the career switch...',
      summary: 'A detailed account of transitioning from mechanical engineering to data science, including the challenges and learning curve.',
      category: 'Career Change',
      tags: ['data science', 'career change', 'learning'],
      course: {
        name: 'Data Science',
        college: 'IIIT Hyderabad',
        year: 2021
      },
      careerPath: {
        from: 'Mechanical Engineer',
        to: 'Data Scientist',
        timeline: '2 years'
      },
      keyAchievements: [
        'Completed online data science certification',
        'Built portfolio of 10+ projects',
        'Landed job at Microsoft',
        'Published research papers'
      ],
      challenges: [
        'Learning programming from scratch',
        'Understanding statistical concepts',
        'Building portfolio without experience'
      ],
      advice: [
        'Start with fundamentals',
        'Build projects to showcase skills',
        'Network with industry professionals',
        'Be patient with the learning process'
      ],
      readTime: 6,
      likes: 189,
      views: 890,
      comments: [],
      isFeatured: false,
      publishedAt: new Date('2024-01-10')
    },
    {
      _id: '3',
      title: 'My Journey from Dropout to Successful Entrepreneur',
      author: {
        name: 'Anita Singh',
        currentRole: 'Founder & CEO',
        company: 'TechStart India',
        experience: '4 years',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Dropping out of college was one of the hardest decisions of my life, but it led me to discover my entrepreneurial spirit...',
      summary: 'An inspiring story of how dropping out of college led to building a successful tech startup.',
      category: 'Entrepreneurship',
      tags: ['entrepreneurship', 'startup', 'innovation'],
      course: {
        name: 'Business Administration',
        college: 'Self-taught',
        year: 2020
      },
      careerPath: {
        from: 'College Dropout',
        to: 'Successful Entrepreneur',
        timeline: '4 years'
      },
      keyAchievements: [
        'Built company from scratch',
        'Raised $2M in funding',
        'Employed 50+ people',
        'Expanded to 3 cities'
      ],
      challenges: [
        'Convincing family about dropping out',
        'Learning business skills',
        'Finding initial funding',
        'Building a team'
      ],
      advice: [
        'Follow your passion',
        'Learn from failures',
        'Build a strong network',
        'Stay persistent'
      ],
      readTime: 10,
      likes: 312,
      views: 1560,
      comments: [],
      isFeatured: true,
      publishedAt: new Date('2024-01-05')
    }
  ]

  const categories = ['All', 'Success Story', 'Career Change', 'Entrepreneurship', 'Academic Journey', 'Industry Insights']

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || story.category === selectedCategory
    const matchesFeatured = !showFeatured || story.isFeatured
    
    return matchesSearch && matchesCategory && matchesFeatured
  })

  const featuredStories = mockStories.filter(story => story.isFeatured)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 mb-4">{t('stories.title')}</h1>
          <p className="text-body max-w-3xl mx-auto">
            {t('stories.subtitle')}
          </p>
        </motion.div>

        {/* Featured Stories */}
        {!showFeatured && featuredStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">{t('stories.featured')}</h2>
              <Button
                variant="outline"
                onClick={() => setShowFeatured(true)}
              >
                View All Featured
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.slice(0, 3).map((story, index) => (
                <StoryCard key={story._id} story={story} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search stories..."
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
                <option value="">Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredStories.map((story, index) => (
            <StoryCard key={story._id} story={story} index={index} />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Story Card Component
const StoryCard = ({ story, index }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(story.likes)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  const contentToShow = showFullContent ? story.content : story.content.substring(0, 200) + '...'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="h-full">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={story.author.profileImage}
            alt={story.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{story.author.name}</h4>
            <p className="text-sm text-gray-600">{story.author.currentRole} at {story.author.company}</p>
          </div>
        </div>

        {/* Story Content */}
        <div className="mb-4">
          <h3 className="heading-4 mb-3">{story.title}</h3>
          <p className="text-gray-600 mb-4">{contentToShow}</p>
          {!showFullContent && (
            <button
              onClick={() => setShowFullContent(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {t('stories.readMore')}
            </button>
          )}
          {showFullContent && (
            <button
              onClick={() => setShowFullContent(false)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {t('stories.readLess')}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-primary">{story.category}</span>
          {story.tags.slice(0, 2).map((tag, tagIndex) => (
            <span key={tagIndex} className="badge-secondary">{tag}</span>
          ))}
        </div>

        {/* Key Achievements */}
        {showFullContent && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Key Achievements:</h5>
            <ul className="space-y-1">
              {story.keyAchievements.slice(0, 3).map((achievement, achIndex) => (
                <li key={achIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Story Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{story.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.views} views</span>
            </div>
          </div>
          <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <MessageCircle className="w-4 h-4" />
              <span>{story.comments.length}</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Stories
