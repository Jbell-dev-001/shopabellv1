'use client'

import { motion } from 'framer-motion'
import { Play, ShoppingBag } from 'lucide-react'

export default function LivestreamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-1">
                <div className="bg-gray-900 rounded-3xl p-4">
                  <div className="bg-gray-800 rounded-2xl aspect-[9/16] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-4 space-y-2"
                  >
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Turn Livestreams Into Shoppable Catalogs
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ShopAbell converts your live product videos into a fully browsable catalog in seconds using AI. 
              Your customers can shop directly from your livestream recordings.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Go live on any platform</h3>
                  <p className="text-gray-600">Facebook, Instagram, WhatsApp - wherever your audience is</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">AI captures products</h3>
                  <p className="text-gray-600">Our AI automatically detects and catalogs products from your video</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Instant shoppable catalog</h3>
                  <p className="text-gray-600">Products are ready to purchase immediately after your stream</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}