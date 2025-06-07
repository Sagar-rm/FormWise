"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-9xl font-bold text-blue-500 opacity-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            404
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10"
          >
            <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#3B82F6"
                d="M47.5,-57.2C59.9,-45.8,67.3,-29.4,70.4,-12.1C73.5,5.2,72.4,23.4,63.8,36.6C55.3,49.8,39.4,58,22.5,65.3C5.7,72.7,-12.1,79.1,-27.4,74.9C-42.7,70.7,-55.6,55.8,-63.5,39.4C-71.4,23,-74.4,5.1,-71.8,-11.9C-69.2,-28.9,-61,-45,-48.2,-56.5C-35.4,-68,-17.7,-74.9,-0.2,-74.7C17.3,-74.5,34.6,-67.2,47.5,-57.2Z"
                transform="translate(100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 mb-8"
        >
          We couldn't find the page you're looking for. The form might have been moved, deleted, or never existed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-gray-500"
      >
        Need help?{" "}
        <Link to="/contact" className="text-blue-600 hover:underline">
          Contact Support
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
