'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Play, RotateCcw, Download, Edit3 } from 'lucide-react'
import VideoProcessor from '@/components/livestream/VideoProcessor'
import ProductEditor from '@/components/livestream/ProductEditor'

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

export default function LivestreamConverterPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [extractedProducts, setExtractedProducts] = useState<ExtractedProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ExtractedProduct | null>(null)
  const [currentStep, setCurrentStep] = useState<'upload' | 'extract' | 'edit' | 'uploaded'>('upload')
  const [isLivestream, setIsLivestream] = useState(false)
  const [uploadedProducts, setUploadedProducts] = useState<ExtractedProduct[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setCurrentStep('extract')
    }
  }

  const handleProductsExtracted = (products: ExtractedProduct[]) => {
    setExtractedProducts(products)
    setCurrentStep('edit')
  }

  const handleProductUpdate = async (updatedProduct: ExtractedProduct) => {
    // Update the product in the list
    setExtractedProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    )
    setSelectedProduct(null)

    // Auto-upload after editing with delay for livestreams
    const uploadDelay = isLivestream ? 120000 : 0 // 2 minutes for livestream, immediate for recorded
    
    setTimeout(async () => {
      await uploadSingleProduct(updatedProduct)
      setUploadedProducts(prev => [...prev, updatedProduct])
    }, uploadDelay)
  }

  const uploadSingleProduct = async (product: ExtractedProduct) => {
    // Simulate API call to upload single product
    console.log('Uploading product to storefront:', product)
    
    // In production, this would be an actual API call
    return new Promise(resolve => setTimeout(resolve, 500))
  }

  const showUploadedSummary = () => {
    setCurrentStep('uploaded')
  }

  const resetProcess = () => {
    setVideoFile(null)
    setVideoUrl('')
    setExtractedProducts([])
    setSelectedProduct(null)
    setUploadedProducts([])
    setIsLivestream(false)
    setCurrentStep('upload')
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
  }

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            Livestream to Catalog Converter 📹➡️📦
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Upload your livestream recording and automatically extract product screenshots every 5 seconds. 
            Crop, enhance, and create catalog listings that upload directly to your storefront.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'upload', label: 'Upload Video', icon: Upload },
              { step: 'extract', label: 'Extract Products', icon: Play },
              { step: 'edit', label: 'Edit & Auto-Upload', icon: Edit3 },
              { step: 'uploaded', label: 'Live on Store', icon: Download }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-purple-600 text-white' 
                    : extractedProducts.length > 0 && index < ['upload', 'extract', 'edit', 'uploaded'].indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Livestream Video</h2>
              <p className="text-gray-600 mb-6">
                Choose a recorded livestream video file to extract product screenshots
              </p>

              <label className="block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 hover:border-purple-500 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports MP4, MOV, AVI, WebM formats
                    </p>
                  </div>
                </div>
              </label>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">📹 Recorded Video</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Instant upload after editing</li>
                    <li>• No delay - products go live immediately</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">🔴 Live Stream</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• 2-minute upload delay</li>
                    <li>• Edit details after upload</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLivestream}
                    onChange={(e) => setIsLivestream(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    This is a live stream recording (2-minute upload delay)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'extract' && videoFile && (
          <VideoProcessor
            videoFile={videoFile}
            videoUrl={videoUrl}
            onProductsExtracted={handleProductsExtracted}
            onProgress={() => {}}
          />
        )}

        {currentStep === 'edit' && extractedProducts.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Extracted Products ({extractedProducts.length})
                  </h2>
                  <button
                    onClick={resetProcess}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Start Over
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {extractedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.croppedImageUrl || product.imageUrl}
                        alt={`Product at ${product.timestamp}s`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                        <Edit3 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(product.timestamp)}s
                      </div>
                      {product.isProcessed && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Auto-Upload Active</h3>
                    <p className="text-sm text-green-700">
                      Products automatically upload {isLivestream ? 'after 2-minute delay' : 'immediately'} when you finish editing them.
                      {uploadedProducts.length > 0 && ` ${uploadedProducts.length} products already uploaded.`}
                    </p>
                  </div>
                  
                  {uploadedProducts.length > 0 && (
                    <button
                      onClick={showUploadedSummary}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      View {uploadedProducts.length} Uploaded Products
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {selectedProduct ? (
                <ProductEditor
                  product={selectedProduct}
                  onUpdate={handleProductUpdate}
                  onClose={() => setSelectedProduct(null)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Instructions</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Click on any screenshot to edit and enhance it:</p>
                    <ul className="space-y-2">
                      <li>• Crop the image to focus on the product</li>
                      <li>• Add product name and description</li>
                      <li>• Set price and quantity</li>
                      <li>• Mark as ready for catalog</li>
                    </ul>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 text-xs">
                        <strong>Tip:</strong> Process images in order of appearance for better organization
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'uploaded' && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Products Uploaded Successfully! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              {uploadedProducts.length} products are now live on your storefront. 
              Customers can browse and purchase them immediately.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">📝 Edit Products Anytime</h3>
              <p className="text-sm text-blue-700">
                Visit your storefront dashboard to update prices, descriptions, quantities, 
                and other product details after upload.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.open('/store/trendy-fashion-x5k9j', '_blank')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                View Live Products
              </button>
              
              <button
                onClick={resetProcess}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Process Another Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}