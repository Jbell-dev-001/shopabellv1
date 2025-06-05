'use client'

import { MessageCircle, MapPin, Clock, Shield, Star } from 'lucide-react'

interface SellerInfoProps {
  businessName: string
  category: string
  whatsapp: string
  description: string
}

export default function SellerInfo({ businessName, category, whatsapp, description }: SellerInfoProps) {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hi! I'm interested in your products from ${businessName}`)
    window.open(`https://wa.me/91${whatsapp}?text=${message}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Seller Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">
              {businessName.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{businessName}</h3>
          <p className="text-sm text-gray-600">{category} Store</p>
        </div>

        <p className="text-sm text-gray-700 mb-4">{description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-700">Verified Seller</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-gray-700">Usually responds within 1 hour</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-gray-700">4.8/5 Customer Rating</span>
          </div>
        </div>

        <button
          onClick={handleWhatsAppContact}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </button>
      </div>

      {/* Store Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Store Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-xs text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">4.8</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.1k</div>
            <div className="text-xs text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">99%</div>
            <div className="text-xs text-gray-600">Positive</div>
          </div>
        </div>
      </div>

      {/* Store Policies */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Store Policies</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Free Shipping</div>
              <div className="text-gray-600">On orders above ₹499</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Easy Returns</div>
              <div className="text-gray-600">7-day return policy</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Secure Payment</div>
              <div className="text-gray-600">UPI & COD available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin size={18} />
          Location
        </h4>
        <div className="text-sm text-gray-600">
          <p>Shipping from Mumbai, Maharashtra</p>
          <p className="mt-1">Delivery available across India</p>
        </div>
      </div>
    </div>
  )
}