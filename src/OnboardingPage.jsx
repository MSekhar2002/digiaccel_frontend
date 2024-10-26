import { Link } from "react-router-dom";

export const OnboardingPage = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="p-6 space-y-6">
            <div className="bg-blue-600 rounded-2xl p-20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Manage What To Do
              </h1>
              <p className="text-gray-600">
                The best way to manage what you have to do, don't forget your plans
              </p>
            </div>
  
            <Link 
              to="/home"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  };