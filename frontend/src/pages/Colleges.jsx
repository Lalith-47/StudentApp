import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Award,
  TrendingUp,
  Building2,
  Plus,
  Minus,
  BarChart3
} from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Input from '../components/UI/Input'
import { apiService } from '../utils/api'

const Colleges = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [compareList, setCompareList] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  // Mock data for colleges
  const mockColleges = [
    {
      _id: '1',
      name: 'Indian Institute of Technology Delhi',
      shortName: 'IIT Delhi',
      type: 'Government',
      location: {
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India'
      },
      established: 1961,
      accreditation: {
        naac: { grade: 'A++', score: 3.8 },
        nirf: { rank: 2, year: 2023 }
      },
      courses: [
        {
          name: 'Computer Science Engineering',
          level: 'UG',
          duration: '4 years',
          fees: { annual: '₹2.5 L', total: '₹10 L' },
          seats: 120,
          eligibility: 'JEE Advanced',
          entranceExam: ['JEE Advanced']
        }
      ],
      facilities: {
        hostel: { available: true, capacity: 2000, fees: '₹1.2 L/year' },
        library: { books: 500000, digital: true },
        labs: ['Computer Lab', 'Electronics Lab', 'Physics Lab'],
        sports: ['Cricket', 'Football', 'Basketball', 'Tennis']
      },
      faculty: {
        total: 500,
        phd: 450,
        studentRatio: '1:12'
      },
      placement: {
        averagePackage: '₹15 LPA',
        highestPackage: '₹1.2 CPA',
        placementPercentage: 95,
        topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Apple'],
        year: 2023
      },
      reviews: [
        {
          rating: 5,
          comment: 'Excellent faculty and infrastructure',
          category: 'Overall',
          author: 'Student',
          date: new Date()
        }
      ]
    },
    {
      _id: '2',
      name: 'Indian Institute of Technology Bombay',
      shortName: 'IIT Bombay',
      type: 'Government',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      established: 1958,
      accreditation: {
        naac: { grade: 'A++', score: 3.9 },
        nirf: { rank: 1, year: 2023 }
      },
      courses: [
        {
          name: 'Computer Science Engineering',
          level: 'UG',
          duration: '4 years',
          fees: { annual: '₹2.5 L', total: '₹10 L' },
          seats: 120,
          eligibility: 'JEE Advanced',
          entranceExam: ['JEE Advanced']
        }
      ],
      facilities: {
        hostel: { available: true, capacity: 2500, fees: '₹1.2 L/year' },
        library: { books: 600000, digital: true },
        labs: ['Computer Lab', 'Electronics Lab', 'Physics Lab'],
        sports: ['Cricket', 'Football', 'Basketball', 'Tennis']
      },
      faculty: {
        total: 600,
        phd: 550,
        studentRatio: '1:10'
      },
      placement: {
        averagePackage: '₹18 LPA',
        highestPackage: '₹1.5 CPA',
        placementPercentage: 98,
        topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Apple'],
        year: 2023
      },
      reviews: [
        {
          rating: 5,
          comment: 'Best engineering college in India',
          category: 'Overall',
          author: 'Student',
          date: new Date()
        }
      ]
    },
    {
      _id: '3',
      name: 'National Institute of Technology Trichy',
      shortName: 'NIT Trichy',
      type: 'Government',
      location: {
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        country: 'India'
      },
      established: 1964,
      accreditation: {
        naac: { grade: 'A+', score: 3.6 },
        nirf: { rank: 5, year: 2023 }
      },
      courses: [
        {
          name: 'Computer Science Engineering',
          level: 'UG',
          duration: '4 years',
          fees: { annual: '₹1.5 L', total: '₹6 L' },
          seats: 120,
          eligibility: 'JEE Main',
          entranceExam: ['JEE Main']
        }
      ],
      facilities: {
        hostel: { available: true, capacity: 1500, fees: '₹80K/year' },
        library: { books: 300000, digital: true },
        labs: ['Computer Lab', 'Electronics Lab', 'Physics Lab'],
        sports: ['Cricket', 'Football', 'Basketball', 'Tennis']
      },
      faculty: {
        total: 300,
        phd: 250,
        studentRatio: '1:15'
      },
      placement: {
        averagePackage: '₹12 LPA',
        highestPackage: '₹50 LPA',
        placementPercentage: 90,
        topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Microsoft'],
        year: 2023
      },
      reviews: [
        {
          rating: 4,
          comment: 'Good college with decent placements',
          category: 'Overall',
          author: 'Student',
          date: new Date()
        }
      ]
    }
  ]

  const cities = ['All', 'New Delhi', 'Mumbai', 'Tiruchirappalli', 'Bangalore', 'Chennai']
  const types = ['All', 'Government', 'Private', 'Deemed University', 'Autonomous']

  const filteredColleges = mockColleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCity = !selectedCity || selectedCity === 'All' || college.location.city === selectedCity
    const matchesType = !selectedType || selectedType === 'All' || college.type === selectedType
    
    return matchesSearch && matchesCity && matchesType
  })

  const addToCompare = (college) => {
    if (compareList.length < 4 && !compareList.find(c => c._id === college._id)) {
      setCompareList([...compareList, college])
    }
  }

  const removeFromCompare = (collegeId) => {
    setCompareList(compareList.filter(c => c._id !== collegeId))
  }

  const isInCompareList = (collegeId) => {
    return compareList.some(c => c._id === collegeId)
  }

  const canAddToCompare = (collegeId) => {
    return compareList.length < 4 && !isInCompareList(collegeId)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 mb-4">{t('colleges.title')}</h1>
          <p className="text-body max-w-3xl mx-auto">
            {t('colleges.subtitle')}
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
                  placeholder={t('colleges.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input"
              >
                <option value="">City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                <option value="">Type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-primary-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-900">
                    {compareList.length} colleges selected for comparison
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    disabled={compareList.length < 2}
                  >
                    Compare Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompareList([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="heading-4 mb-1">{college.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{college.shortName}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{college.location.city}, {college.location.state}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-primary">{college.type}</span>
                  <span className="badge-secondary">Est. {college.established}</span>
                  {college.accreditation.nirf && (
                    <span className="badge-success">NIRF #{college.accreditation.nirf.rank}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-900">{college.placement.averagePackage}</div>
                    <div className="text-xs text-gray-500">Avg Package</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-900">{college.placement.placementPercentage}%</div>
                    <div className="text-xs text-gray-500">Placement</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Top Recruiters:</h4>
                  <div className="flex flex-wrap gap-1">
                    {college.placement.topRecruiters.slice(0, 3).map((recruiter, recruiterIndex) => (
                      <span key={recruiterIndex} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                        {recruiter}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    {t('colleges.viewDetails')}
                  </Button>
                  {canAddToCompare(college._id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCompare(college)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  ) : isInCompareList(college._id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCompare(college._id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Maximum 4 colleges can be compared"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Colleges
