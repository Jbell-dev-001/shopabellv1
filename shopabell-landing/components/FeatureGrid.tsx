'use client'

import { motion } from 'framer-motion'
import { Clock, Video, MessageSquare, CreditCard, Truck, BarChart3 } from 'lucide-react'

const features = [
  {
    title: '30-Second Setup',
    description: 'Go from zero to online store in just 30 seconds via WhatsApp',
    icon: Clock,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Livestream to Store',
    description: 'Convert your live videos into shoppable product catalogs instantly',
    icon: Video,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Sell Command',
    description: 'Simple commands to manage inventory and process orders',
    icon: MessageSquare,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Universal Payments',
    description: 'Accept all payment methods - UPI, cards, wallets, and COD',
    icon: CreditCard,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Automated Shipping',
    description: 'Integrated logistics with automated tracking and delivery',
    icon: Truck,
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Seller Analytics',
    description: 'Real-time insights on sales, customers, and performance',
    icon: BarChart3,
    color: 'from-indigo-500 to-indigo-600'
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Sell Online
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools you need to run your online business, no technical skills required
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}