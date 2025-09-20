import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Map, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t('home.features.quiz.title'),
      description: t('home.features.quiz.description'),
      link: '/quiz',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: t('home.features.roadmap.title'),
      description: t('home.features.roadmap.description'),
      link: '/roadmap',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: t('home.features.colleges.title'),
      description: t('home.features.colleges.description'),
      link: '/colleges',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('home.features.stories.title'),
      description: t('home.features.stories.description'),
      link: '/stories',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const stats = [
    { label: 'Students Helped', value: '10,000+', icon: <Users className="w-5 h-5" /> },
    { label: 'Career Paths', value: '50+', icon: <Map className="w-5 h-5" /> },
    { label: 'Colleges Listed', value: '500+', icon: <Building2 className="w-5 h-5" /> },
    { label: 'Success Stories', value: '200+', icon: <Star className="w-5 h-5" /> }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Google',
      content: 'CareerGuide helped me discover my passion for technology and guided me through the entire journey from college selection to landing my dream job.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Rahul Kumar',
      role: 'Data Scientist at Microsoft',
      content: 'The career assessment quiz was incredibly accurate. It helped me understand my strengths and choose the right path in data science.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Anita Singh',
      role: 'Doctor at AIIMS',
      content: 'The roadmap feature provided me with a clear path to achieve my medical career goals. Highly recommended for aspiring doctors.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-1 text-white mb-6">
                {t('home.title')}
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/quiz">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                    {t('home.cta')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/roadmap">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Explore Roadmaps
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Career Assessment Complete</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-sm text-primary-100">Recommended: Software Engineering</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>95% Match with your interests</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4">Everything You Need for Career Success</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to make informed career decisions and achieve your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="heading-4 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4">What Our Users Say</h2>
            <p className="text-body max-w-3xl mx-auto">
              Join thousands of students who have found their perfect career path with our guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2 text-white mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Take our comprehensive career assessment quiz and discover your ideal career path in just 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Take Career Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/stories">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Read Success Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
