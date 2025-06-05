'use client'

import { motion } from 'framer-motion'
import { Smartphone, Video, MessageCircle, DollarSign } from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Register via WhatsApp',
    description: 'Send a simple message to our WhatsApp number to create your store',
    icon: Smartphone,
    color: 'from-purple-500 to-purple-600'
  },
  {
    number: '2',
    title: 'Go Live & Show Products',
    description: 'Start your live video and showcase your products naturally',
    icon: Video,
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: '3',
    title: 'Chat & Sell',
    description: 'Interact with customers and take orders through simple chat commands',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600'
  },
  {
    number: '4',
    title: 'Get Paid & Ship',
    description: 'Receive payments instantly and ship with automated logistics',
    icon: DollarSign,
    color: 'from-orange-500 to-orange-600'
  }
]

export default function WorkflowSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sell Online in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No complicated setup. Start selling in minutes, not days.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-500 mb-2">STEP {step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}