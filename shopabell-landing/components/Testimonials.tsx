'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, ShoppingCart, IndianRupee } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    business: 'Priya\'s Boutique',
    quote: 'I doubled my orders within 2 weeks of joining ShopAbell. The livestream feature changed everything!',
    rating: 5,
    image: '👩'
  },
  {
    name: 'Rajesh Kumar',
    business: 'Kumar Electronics',
    quote: 'Finally, a platform that understands Indian sellers. WhatsApp integration is genius!',
    rating: 5,
    image: '👨'
  },
  {
    name: 'Fatima Sheikh',
    business: 'Handmade Crafts',
    quote: 'From 10 orders a month to 10 orders a day. ShopAbell made selling online so simple.',
    rating: 5,
    image: '🧕'
  }
]

const stats = [
  {
    icon: ShoppingCart,
    value: '10K+',
    label: 'Active Sellers',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: TrendingUp,
    value: '2M+',
    label: 'Monthly Transactions',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: IndianRupee,
    value: '₹100Cr+',
    label: 'Monthly GMV',
    color: 'from-green-500 to-green-600'
  }
]

export default function Testimonials() {
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
            Trusted by Thousands of Sellers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the fastest growing community of social sellers in India
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
              
              <div className="flex items-center gap-3">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.business}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}