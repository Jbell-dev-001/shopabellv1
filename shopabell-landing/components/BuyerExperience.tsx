'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Shield, Truck, ShoppingBag } from 'lucide-react'

const products = [
  { id: 1, name: 'Designer Saree', price: '₹2,499', image: '🥻' },
  { id: 2, name: 'Handmade Jewelry', price: '₹899', image: '💍' },
  { id: 3, name: 'Leather Handbag', price: '₹3,999', image: '👜' },
  { id: 4, name: 'Artisan Shoes', price: '₹2,199', image: '👠' },
  { id: 5, name: 'Silk Dupatta', price: '₹1,299', image: '🧣' },
  { id: 6, name: 'Traditional Kurta', price: '₹1,599', image: '👔' }
]

const benefits = [
  {
    icon: MessageCircle,
    title: 'Click to Chat Purchase',
    description: 'Buy directly through WhatsApp chat'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Multiple payment options with buyer protection'
  },
  {
    icon: Truck,
    title: 'Order Tracking',
    description: 'Real-time updates on your delivery status'
  }
]

export default function BuyerExperience() {
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
            Delightful Buyer Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your customers get a seamless shopping experience from discovery to delivery
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-5xl mb-3 text-center">{product.image}</div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-lg font-bold text-purple-600">{product.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Why Buyers Love ShopAbell
            </h3>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-purple-50 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
                <h4 className="text-lg font-semibold text-gray-900">Smart Product Discovery</h4>
              </div>
              <p className="text-gray-600">
                Buyers can browse through AI-organized catalogs, search products, and get personalized recommendations
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}