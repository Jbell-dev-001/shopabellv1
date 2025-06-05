'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Square, Download } from 'lucide-react'

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

interface VideoProcessorProps {
  videoFile: File
  videoUrl: string
  onProductsExtracted: (products: ExtractedProduct[]) => void
  onProgress: (progress: number) => void
}

export default function VideoProcessor({ 
  videoUrl, 
  onProductsExtracted, 
  onProgress 
}: VideoProcessorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedProducts, setExtractedProducts] = useState<ExtractedProduct[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const captureFrame = (): string => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return ''

    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob URL
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const extractProducts = async () => {
    if (!videoRef.current) {
      console.error('Video element not found')
      return
    }

    if (!duration || duration === 0) {
      console.error('Video duration not available')
      alert('Please wait for the video to load completely before extracting products.')
      return
    }

    setIsExtracting(true)
    setExtractionProgress(0)
    
    const video = videoRef.current
    const products: ExtractedProduct[] = []
    const interval = 5 // 5 seconds
    
    console.log(`Starting extraction for video duration: ${duration} seconds`)
    
    // Reset video to start
    video.currentTime = 0
    
    return new Promise<void>((resolve) => {
      const timeMarks: number[] = []
      for (let t = 0; t < duration; t += interval) {
        timeMarks.push(t)
      }
      
      let currentIndex = 0
      
      const processNextFrame = () => {
        if (currentIndex >= timeMarks.length) {
          setIsExtracting(false)
          setExtractionProgress(100)
          setExtractedProducts(products)
          onProductsExtracted(products)
          onProgress(100)
          resolve()
          return
        }
        
        const timestamp = timeMarks[currentIndex]
        video.currentTime = timestamp
        
        const handleSeeked = () => {
          // Small delay to ensure frame is fully loaded
          setTimeout(() => {
            const imageUrl = captureFrame()
            
            if (imageUrl) {
              const product: ExtractedProduct = {
                id: `product_${timestamp}_${Date.now()}`,
                timestamp,
                imageUrl,
                isProcessed: false
              }
              
              products.push(product)
              setExtractedProducts([...products])
              console.log(`Extracted frame at ${timestamp}s`)
            } else {
              console.warn(`Failed to capture frame at ${timestamp}s`)
            }
            
            currentIndex++
            const progress = (currentIndex / timeMarks.length) * 100
            setExtractionProgress(progress)
            onProgress(progress)
            
            video.removeEventListener('seeked', handleSeeked)
            processNextFrame()
          }, 200) // Increased delay for better frame loading
        }
        
        video.addEventListener('seeked', handleSeeked)
      }
      
      processNextFrame()
    })
  }

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      setDuration(videoDuration)
      setIsVideoLoading(false)
      console.log(`Video loaded successfully. Duration: ${videoDuration} seconds`)
    }
  }

  const handleVideoError = () => {
    console.error('Video failed to load')
    setIsVideoLoading(false)
    alert('Failed to load video. Please try uploading a different video file or check your internet connection.')
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('ended', () => setIsPlaying(false))
      video.addEventListener('error', handleVideoError)
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('ended', () => setIsPlaying(false))
        video.removeEventListener('error', handleVideoError)
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Video Processing</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Player */}
        <div>
          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              controls={false}
              preload="metadata"
              crossOrigin="anonymous"
            />
            
            {/* Loading Overlay */}
            {isVideoLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}
            
            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <button
                  onClick={handlePlay}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                    disabled={isExtracting}
                  />
                </div>
                
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Extract Button */}
          <button
            onClick={extractProducts}
            disabled={isExtracting || !duration || isVideoLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExtracting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Extracting Screenshots... {Math.round(extractionProgress)}%
              </>
            ) : (
              <>
                <Download size={20} />
                Extract Products (Every 5 seconds)
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isExtracting && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Extracting screenshots from video...</span>
                <span>{Math.round(extractionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-purple-600">
                <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Taking screenshots every 5 seconds...</span>
              </div>
            </div>
          )}
        </div>

        {/* Extraction Preview */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Extracted Screenshots ({extractedProducts.length})
          </h3>
          
          {extractedProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {extractedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <img
                    src={product.imageUrl}
                    alt={`Frame at ${product.timestamp}s`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                    {Math.floor(product.timestamp)}s
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Square className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Screenshots will appear here during extraction</p>
              <p className="text-sm mt-1">Click &quot;Extract Products&quot; to begin</p>
            </div>
          )}

          {extractedProducts.length > 0 && !isExtracting && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Extracted {extractedProducts.length} product screenshots
              </p>
              <p className="text-green-700 text-xs mt-1">
                Ready to crop and enhance images
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}