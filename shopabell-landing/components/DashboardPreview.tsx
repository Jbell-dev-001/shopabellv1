'use client'

import { motion } from 'framer-motion'
import { TrendingUp, ShoppingCart, Eye, BarChart } from 'lucide-react'

const kpis = [
  {
    label: 'Orders',
    value: '1,234',
    change: '+23%',
    icon: ShoppingCart,
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Revenue',
    value: '₹45,678',
    change: '+18%',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Views',
    value: '23,456',
    change: '+45%',
    icon: Eye,
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Conversion Rate',
    value: '5.2%',
    change: '+2.1%',
    icon: BarChart,
    color: 'from-orange-500 to-orange-600'
  }
]

export default function DashboardPreview() {
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
            Powerful Seller Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your business performance with real-time analytics and insights
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Dashboard Overview</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${kpi.color} rounded-xl flex items-center justify-center`}>
                      <kpi.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">{kpi.change}</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                    <div className="text-sm text-gray-600">{kpi.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h4>
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 95, 60, 75, 90, 85, 100, 95, 110].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h4>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((order) => (
                    <div key={order} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Order #{1000 + order}</div>
                          <div className="text-xs text-gray-600">2 items</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">₹{499 + order * 100}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}