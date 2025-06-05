'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 py-20 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Turn Social Media Into Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Online Store</span>
            <br />in 30 Seconds
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Perfect for Facebook sellers, resellers, live-sellers, and boutique owners. 
            Start selling online without any technical knowledge or website building.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
              Start Selling Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="/demo" className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full text-lg border-2 border-gray-200 hover:border-purple-600 hover:text-purple-600 transition-all duration-300 inline-block">
              Try WhatsApp Demo
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-gray-800 mb-2">20,000+ sellers joined in a week</p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">⭐</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-10 left-10 hidden lg:block"
      >
        <div className="relative">
          <div className="w-32 h-24 bg-purple-600 rounded-lg transform rotate-3 flex items-center justify-center">
            <Package className="w-12 h-12 text-white" />
          </div>
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              rotate: [3, -3, 3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-5 -right-5 w-20 h-16 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <Package className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}