'use client'

import { useState } from 'react'
import { CheckCircle, Upload, Eye, RotateCcw } from 'lucide-react'

interface ExtractedProduct {
  id: string
  timestamp: number
  imageUrl: string
  croppedImageUrl?: string
  name?: string
  price?: number
  description?: string
  quantity?: number
  isProcessed: boolean
}

interface CatalogPreviewProps {
  products: ExtractedProduct[]
  onReset: () => void
}

export default function CatalogPreview({ products, onReset }: CatalogPreviewProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleUploadToStorefront = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setUploadProgress(i)
    }

    // Simulate API call to upload products
    try {
      // In production, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Uploading products to storefront:', products)
      
      setIsUploaded(true)
      setIsUploading(false)
    } catch (error) {
      console.error('Upload failed:', error)
      setIsUploading(false)
    }
  }

  const totalValue = products.reduce((sum, product) => {
    return sum + ((product.price || 0) * (product.quantity || 1))
  }, 0)

  if (isUploaded) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Products Successfully Uploaded! 🎉
        </h2>
        
        <p className="text-gray-600 mb-6">
          {products.length} products have been added to your storefront catalog.
          They are now live and available for customers to purchase.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">Upload Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Products Added:</span>
              <span className="font-medium ml-2">{products.length}</span>
            </div>
            <div>
              <span className="text-green-700">Total Value:</span>
              <span className="font-medium ml-2">₹{totalValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-green-700">Categories:</span>
              <span className="font-medium ml-2">Auto-detected</span>
            </div>
            <div>
              <span className="text-green-700">Status:</span>
              <span className="font-medium ml-2">Live</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.open('/store/trendy-fashion-x5k9j', '_blank')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Eye size={20} />
            View Storefront
          </button>
          
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Process Another Video
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Catalog Preview</h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{products.length}</div>
          <div className="text-sm text-blue-700">Products</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">₹{totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-700">Total Value</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {products.filter(p => p.price && p.price > 0).length}
          </div>
          <div className="text-sm text-purple-700">Priced</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {products.filter(p => p.name && p.name.length > 0).length}
          </div>
          <div className="text-sm text-orange-700">Named</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Ready for Upload</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.croppedImageUrl || product.imageUrl}
                  alt={product.name || `Product at ${product.timestamp}s`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {product.name || 'Unnamed Product'}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-medium text-purple-600">
                    {product.price ? `₹${product.price.toLocaleString()}` : 'No price'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Qty: {product.quantity || 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {product.description || 'No description'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="border-t pt-6">
        {!isUploading ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Ready to Launch</h3>
              <p className="text-sm text-blue-700">
                Your products will be automatically uploaded to your storefront and become 
                available for customers to browse and purchase immediately.
              </p>
            </div>

            <button
              onClick={handleUploadToStorefront}
              disabled={products.length === 0}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
            >
              <Upload size={24} />
              Upload {products.length} Products to Storefront
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Uploading to Storefront...</h3>
              <p className="text-gray-600">Please wait while we add your products</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Upload Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Processing product images...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Creating catalog entries...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Updating storefront...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}