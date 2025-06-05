'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Play, RotateCcw, Download, Edit3 } from 'lucide-react'
import VideoProcessor from '@/components/livestream/VideoProcessor'
import ProductEditor from '@/components/livestream/ProductEditor'
import CatalogPreview from '@/components/livestream/CatalogPreview'

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
  const [currentStep, setCurrentStep] = useState<'upload' | 'extract' | 'edit' | 'catalog'>('upload')

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

  const handleProductUpdate = (updatedProduct: ExtractedProduct) => {
    setExtractedProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    )
    setSelectedProduct(null)
  }

  const handleUploadToCatalog = async () => {
    // Simulate uploading to storefront
    setCurrentStep('catalog')
    // In production, this would upload to the actual storefront API
    console.log('Uploading products to catalog:', extractedProducts)
  }

  const resetProcess = () => {
    setVideoFile(null)
    setVideoUrl('')
    setExtractedProducts([])
    setSelectedProduct(null)
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
              { step: 'edit', label: 'Edit & Enhance', icon: Edit3 },
              { step: 'catalog', label: 'Upload to Catalog', icon: Download }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-purple-600 text-white' 
                    : extractedProducts.length > 0 && index < ['upload', 'extract', 'edit', 'catalog'].indexOf(currentStep)
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Screenshots taken every 5 seconds automatically</li>
                  <li>• Client-side processing - your video never leaves your device</li>
                  <li>• Crop and enhance images before cataloging</li>
                  <li>• Add product details and upload to storefront</li>
                </ul>
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

                <button
                  onClick={handleUploadToCatalog}
                  disabled={extractedProducts.filter(p => p.isProcessed).length === 0}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Upload {extractedProducts.filter(p => p.isProcessed).length} Products to Catalog
                </button>
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

        {currentStep === 'catalog' && (
          <CatalogPreview
            products={extractedProducts.filter(p => p.isProcessed)}
            onReset={resetProcess}
          />
        )}
      </div>
    </div>
  )
}