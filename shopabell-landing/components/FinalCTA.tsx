'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Smartphone } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start Selling in 30 Seconds
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            Join 20,000+ sellers who are already growing their business with ShopAbell
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="https://wa.me/919999999999?text=I%20want%20to%20start%20selling%20on%20ShopAbell"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-500 text-white font-semibold rounded-full text-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <MessageCircle className="w-6 h-6" />
              Start Selling on WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full text-lg hover:bg-gray-100 transition-all duration-300"
            >
              Download Brochure
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Quick Onboarding Preview</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="text-white">Send &quot;Hi&quot; to WhatsApp</span>
              </div>
              <ArrowRight className="w-6 h-6 text-white/60" />
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white">Get Store Link</span>
              </div>
              <ArrowRight className="w-6 h-6 text-white/60" />
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">₹</span>
                </div>
                <span className="text-white">Start Earning</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full"
      />
    </section>
  )
}