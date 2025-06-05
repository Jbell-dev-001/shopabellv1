import WhatsAppOnboarding from '@/components/WhatsAppOnboarding'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Instructions */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              WhatsApp Onboarding Demo 📱
            </h1>
            
            <p className="text-gray-600 mb-6">
              Experience how easy it is to set up your Shopabell store through WhatsApp!
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 Quick Setup Process</h3>
                <p className="text-sm text-blue-700">
                  Just like chatting with a friend! Answer a few questions and your store is ready.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">💬 What You&apos;ll Need:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Your business name</li>
                  <li>• Product category (Fashion, Electronics, etc.)</li>
                  <li>• UPI ID for payments</li>
                  <li>• WhatsApp phone number</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">✨ You&apos;ll Get:</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Unique store URL</li>
                  <li>• Login credentials</li>
                  <li>• Instant store activation</li>
                  <li>• Ready to sell immediately!</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Try it out:</strong> This is a simulation of our actual WhatsApp onboarding. 
                  In production, this happens directly in your WhatsApp!
                </p>
              </div>
            </div>
          </div>

          {/* Right side - WhatsApp Interface */}
          <div className="lg:sticky lg:top-8">
            <WhatsAppOnboarding />
          </div>
        </div>
      </div>
    </div>
  )
}