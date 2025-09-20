import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Quiz = React.lazy(() => import('./pages/Quiz'))
const Roadmap = React.lazy(() => import('./pages/Roadmap'))
const Colleges = React.lazy(() => import('./pages/Colleges'))
const Stories = React.lazy(() => import('./pages/Stories'))
const Chatbot = React.lazy(() => import('./pages/Chatbot'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="colleges" element={<Colleges />} />
            <Route path="stories" element={<Stories />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
