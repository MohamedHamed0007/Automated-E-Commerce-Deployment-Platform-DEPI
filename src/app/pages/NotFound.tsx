import React from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full text-center py-16 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
      
  
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Need help? Contact our support team:</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center text-sm">
            <a href="mailto:support@shipfast.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@shipfast.com
            </a>
            <span className="hidden sm:block text-gray-400 dark:text-gray-700">|</span>
            <a href="tel:1-800-SHIP-FAST" className="text-blue-600 dark:text-blue-400 hover:underline">
              1-800-SHIP-FAST
            </a>
            <span className="hidden sm:block text-gray-400 dark:text-gray-700">|</span>
            <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
              Help Center
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}