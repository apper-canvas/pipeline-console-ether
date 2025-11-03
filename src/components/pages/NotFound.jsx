import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
          <p className="text-lg text-secondary max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-x-4">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound