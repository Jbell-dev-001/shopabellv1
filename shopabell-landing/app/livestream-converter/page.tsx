'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Play, RotateCcw, Download, Edit3 } from 'lucide-react'
import VideoProcessor from '@/components/livestream/VideoProcessor'

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
  const [facebookUrl, setFacebookUrl] = useState<string>('')
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [extractedProducts, setExtractedProducts] = useState<ExtractedProduct[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'extract' | 'processing' | 'uploaded'>('upload')
  const [isLivestream, setIsLivestream] = useState(false)
  const [uploadedProducts, setUploadedProducts] = useState<ExtractedProduct[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [urlError, setUrlError] = useState<string>('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setUrlError('')
      setCurrentStep('extract')
    }
  }

  const validateVideoUrl = (url: string): boolean => {
    // Basic URL validation
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Removed extractVideoId function as we're simplifying validation for demo

  const handleUrlSubmit = async () => {
    setUrlError('')
    
    if (!facebookUrl.trim()) {
      setUrlError('Please enter a Facebook video URL')
      return
    }

    if (!validateVideoUrl(facebookUrl)) {
      setUrlError('Please enter a valid URL')
      return
    }

    // Check if it's a Facebook-related URL
    const isFacebookUrl = facebookUrl.includes('facebook.com') || 
                         facebookUrl.includes('fb.watch') || 
                         facebookUrl.includes('m.facebook.com')
    
    if (!isFacebookUrl) {
      setUrlError('Please enter a Facebook video URL (facebook.com or fb.watch)')
      return
    }

    try {
      // For demo purposes, we'll process any valid Facebook URL
      // In production, you'd use Facebook Graph API or a video processing service
      const processedUrl = await processVideoUrl()
      setVideoUrl(processedUrl)
      setCurrentStep('extract')
    } catch {
      setUrlError('Unable to process this video URL. Please try a different link or upload the video file directly.')
    }
  }

  const processVideoUrl = async (): Promise<string> => {
    // Simulate processing Facebook video URL
    // In production, this would involve:
    // 1. Facebook Graph API to get video metadata
    // 2. Extract direct video URL
    // 3. Handle authentication and permissions
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, we'll use a sample video URL
        // In production, replace with actual Facebook video processing
        const sampleVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        resolve(sampleVideoUrl)
      }, 2000)
    })
  }

  const handleProductsExtracted = async (products: ExtractedProduct[]) => {
    setExtractedProducts(products)
    setCurrentStep('processing')
    
    // Auto-process all products
    await autoProcessAllProducts(products)
  }

  const autoProcessAllProducts = async (products: ExtractedProduct[]) => {
    const processedProducts: ExtractedProduct[] = []
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const progress = ((i + 1) / products.length) * 100
      setProcessingProgress(progress)
      
      // Auto-enhance the product
      const enhancedProduct = await autoEnhanceProduct(product)
      processedProducts.push(enhancedProduct)
      
      // Auto-upload with delay for livestreams
      const uploadDelay = isLivestream ? 120000 : 1000 // 2 minutes for livestream, 1 second for recorded
      
      setTimeout(async () => {
        await uploadSingleProduct(enhancedProduct)
        setUploadedProducts(prev => [...prev, enhancedProduct])
        
        // If this is the last product, show uploaded summary
        if (i === products.length - 1) {
          setTimeout(() => setCurrentStep('uploaded'), 1000)
        }
      }, uploadDelay)
    }
    
    setExtractedProducts(processedProducts)
  }

  const autoEnhanceProduct = async (product: ExtractedProduct): Promise<ExtractedProduct> => {
    // Auto-crop to standard dimensions (1:1 square)
    const croppedImageUrl = await autoCropToSquare(product.imageUrl)
    
    // Generate automatic product details
    const autoName = `Product ${Math.floor(product.timestamp)}s`
    const autoPrice = Math.floor(Math.random() * 2000) + 500 // Random price between 500-2500
    const autoDescription = `Premium quality product from livestream at ${Math.floor(product.timestamp)} seconds`
    
    return {
      ...product,
      croppedImageUrl,
      name: autoName,
      price: autoPrice,
      description: autoDescription,
      quantity: 1,
      isProcessed: true
    }
  }

  const autoCropToSquare = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          resolve(imageUrl)
          return
        }
        
        // Set standard square dimensions
        const size = 400
        canvas.width = size
        canvas.height = size
        
        // Calculate crop area (center square)
        const sourceSize = Math.min(img.width, img.height)
        const sourceX = (img.width - sourceSize) / 2
        const sourceY = (img.height - sourceSize) / 2
        
        // Draw cropped image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceSize, sourceSize,
          0, 0, size, size
        )
        
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = imageUrl
    })
  }

  const uploadSingleProduct = async (product: ExtractedProduct) => {
    // Simulate API call to upload single product
    console.log('Uploading product to storefront:', product)
    
    // In production, this would be an actual API call
    return new Promise(resolve => setTimeout(resolve, 500))
  }


  const resetProcess = () => {
    setVideoFile(null)
    setVideoUrl('')
    setFacebookUrl('')
    setExtractedProducts([])
    setUploadedProducts([])
    setIsLivestream(false)
    setProcessingProgress(0)
    setUploadMethod('file')
    setUrlError('')
    setCurrentStep('upload')
    if (videoUrl && videoFile) {
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
            Upload your livestream recording and automatically extract, process, and upload product screenshots every 5 seconds. 
            Everything happens automatically - no manual editing required!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'upload', label: 'Upload Video', icon: Upload },
              { step: 'extract', label: 'Extract Screenshots', icon: Play },
              { step: 'processing', label: 'Auto-Process', icon: Edit3 },
              { step: 'uploaded', label: 'Live on Store', icon: Download }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-purple-600 text-white' 
                    : extractedProducts.length > 0 && index < ['upload', 'extract', 'processing', 'uploaded'].indexOf(currentStep)
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
                Upload a video file or paste a Facebook video link to extract product screenshots
              </p>

              {/* Upload Method Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    uploadMethod === 'url'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🔗 Facebook Link
                </button>
              </div>

              {uploadMethod === 'file' ? (
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
              ) : (
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Video URL
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://www.facebook.com/watch/?v=123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    {urlError && (
                      <p className="mt-2 text-sm text-red-600">{urlError}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!facebookUrl.trim()}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Process Facebook Video
                  </button>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">📘 Supported Facebook URLs:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• facebook.com/watch/?v=123456789</li>
                      <li>• facebook.com/username/videos/123456789</li>
                      <li>• fb.watch/abc123</li>
                      <li>• facebook.com/reel/123456789</li>
                      <li>• m.facebook.com/watch/?v=123456789</li>
                      <li>• Any Facebook video or reel URL</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">
                      <strong>Demo:</strong> Any valid Facebook URL will work for testing purposes
                    </p>
                  </div>
                </div>
              )}

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

        {currentStep === 'processing' && (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Processing Products</h2>
              <p className="text-gray-600">
                Automatically cropping, enhancing, and uploading {extractedProducts.length} products...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Processing products...</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Crop</h3>
                <p className="text-sm text-gray-600">
                  Cropping all images to 400x400px squares for consistency
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Enhance</h3>
                <p className="text-sm text-gray-600">
                  Adding product names, prices, and descriptions automatically
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Upload</h3>
                <p className="text-sm text-gray-600">
                  Uploading to storefront {isLivestream ? 'after 2-min delay' : 'immediately'}
                </p>
              </div>
            </div>

            {/* Product Preview Grid */}
            {extractedProducts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Processing Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {extractedProducts.map((product) => (
                    <div key={product.id} className="relative">
                      <img
                        src={product.croppedImageUrl || product.imageUrl}
                        alt={`Product at ${product.timestamp}s`}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {Math.floor(product.timestamp)}s
                      </div>
                      {product.isProcessed && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <p className="text-sm text-blue-700 mb-3">
                All products were automatically processed and uploaded. You can now edit details in your dashboard:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Update product names and descriptions</li>
                <li>• Adjust prices and quantities</li>
                <li>• Add more product details</li>
                <li>• Change product categories</li>
              </ul>
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