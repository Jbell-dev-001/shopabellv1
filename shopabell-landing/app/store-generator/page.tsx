'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react'

interface StoreInfo {
  businessName: string
  category: string
  upiId: string
  phone: string
  storeUrl: string
  loginEmail: string
  password: string
}

export default function StoreGeneratorPage() {
  const [copied, setCopied] = useState(false)
  const [generatedStore, setGeneratedStore] = useState<StoreInfo | null>(null)

  // Sample data from WhatsApp onboarding
  const sampleData = {
    businessName: 'Trendy Fashion',
    category: 'Fashion',
    upiId: 'trendyfashion@paytm',
    phone: '9876543210',
    storeUrl: 'trendy-fashion-x5k9j.shopabell.store',
    loginEmail: '9876543210@shopabell.com',
    password: 'ShopAbc123!'
  }

  const generateNewStore = () => {
    // Simulate store generation
    const businessNames = ['Fashion Hub', 'Tech Store', 'Beauty Corner', 'Sports Zone']
    const categories = ['Fashion', 'Electronics', 'Beauty', 'Sports']
    
    const randomBusiness = businessNames[Math.floor(Math.random() * businessNames.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const slug = randomBusiness.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const randomId = Math.random().toString(36).substr(2, 5)
    
    setGeneratedStore({
      businessName: randomBusiness,
      category: randomCategory,
      upiId: `${slug}@paytm`,
      phone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
      storeUrl: `${slug}-${randomId}.shopabell.store`,
      loginEmail: `98765${Math.floor(10000 + Math.random() * 90000)}@shopabell.com`,
      password: `Shop${Math.random().toString(36).substr(2, 8)}!`
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentStore = generatedStore || sampleData

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Auto-Generated Storefront 🏪
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how Shopabell automatically generates beautiful, mobile-responsive storefronts 
            based on your WhatsApp onboarding data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Store Details */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Store Details</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🏪 Store Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Business Name:</strong> {currentStore.businessName}</div>
                  <div><strong>Category:</strong> {currentStore.category}</div>
                  <div><strong>Phone:</strong> {currentStore.phone}</div>
                  <div><strong>UPI ID:</strong> {currentStore.upiId}</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">🌐 Store URL</h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-white px-3 py-2 rounded border">
                    https://{currentStore.storeUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`https://${currentStore.storeUrl}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">🔐 Login Credentials</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {currentStore.loginEmail}</div>
                  <div><strong>Password:</strong> {currentStore.password}</div>
                </div>
              </div>

              <button
                onClick={generateNewStore}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate New Store
              </button>
            </div>
          </div>

          {/* Store Preview */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Live Store Preview</h2>
              <Link
                href="/store/trendy-fashion-x5k9j"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Open Full Store
                <ExternalLink size={16} />
              </Link>
            </div>

            {/* Mobile Preview Frame */}
            <div className="mx-auto max-w-sm">
              <div className="bg-gray-900 rounded-[2rem] p-2">
                <div className="bg-white rounded-[1.5rem] overflow-hidden">
                  {/* Store Header Preview */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 text-center">
                    <h3 className="font-bold">{currentStore.businessName}</h3>
                    <p className="text-sm opacity-90">{currentStore.category} • Powered by Shopabell</p>
                  </div>

                  {/* Products Preview */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-1"></div>
                            <div className="text-xs text-gray-600">Product {i + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{currentStore.businessName}</div>
                      <div className="text-xs text-gray-600">{currentStore.category} Store</div>
                      <button className="w-full mt-2 py-2 bg-green-600 text-white rounded text-xs">
                        Chat on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Mobile-responsive design automatically generated
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Auto-Generated Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Theme</h3>
              <p className="text-sm text-gray-600">
                Automatically applies brand colors and styling based on category
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-sm text-gray-600">
                Responsive design optimized for mobile shopping experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600">
                Products and inventory sync automatically as you add them
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}