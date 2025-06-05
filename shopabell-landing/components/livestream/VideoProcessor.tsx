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
  videoFile?: File | null
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
  const [videoError, setVideoError] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)

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

    const videoDuration = videoRef.current.duration
    console.log('Extract function - videoDuration:', videoDuration, 'state duration:', duration)

    if (!videoDuration || videoDuration === 0 || isNaN(videoDuration) || !isFinite(videoDuration)) {
      console.error('Video duration not available. videoDuration:', videoDuration, 'state duration:', duration)
      alert('Please wait for the video to load completely before extracting products.')
      return
    }

    // Use the actual video duration instead of state
    const actualDuration = videoDuration

    setIsExtracting(true)
    setExtractionProgress(0)
    
    const video = videoRef.current
    const products: ExtractedProduct[] = []
    const interval = 5 // 5 seconds
    
    console.log(`Starting extraction for video duration: ${actualDuration} seconds`)
    
    // Reset video to start
    video.currentTime = 0
    
    return new Promise<void>((resolve) => {
      const timeMarks: number[] = []
      for (let t = 0; t < actualDuration; t += interval) {
        timeMarks.push(t)
      }
      
      console.log('Time marks for extraction:', timeMarks)
      
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
          console.log(`Seeked to ${timestamp}s, processing frame...`)
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
              console.log(`✓ Extracted frame at ${timestamp}s`)
            } else {
              console.warn(`✗ Failed to capture frame at ${timestamp}s`)
            }
            
            currentIndex++
            const progress = (currentIndex / timeMarks.length) * 100
            setExtractionProgress(progress)
            onProgress(progress)
            
            video.removeEventListener('seeked', handleSeeked)
            video.removeEventListener('error', handleSeekError)
            processNextFrame()
          }, 200) // Increased delay for better frame loading
        }
        
        const handleSeekError = () => {
          console.error(`Seek error at ${timestamp}s`)
          video.removeEventListener('seeked', handleSeeked)
          video.removeEventListener('error', handleSeekError)
          currentIndex++
          processNextFrame()
        }
        
        // Add timeout to prevent getting stuck
        const seekTimeout = setTimeout(() => {
          console.warn(`Seek timeout at ${timestamp}s, moving to next frame`)
          video.removeEventListener('seeked', handleSeeked)
          video.removeEventListener('error', handleSeekError)
          currentIndex++
          processNextFrame()
        }, 5000)
        
        video.addEventListener('seeked', handleSeeked)
        video.addEventListener('error', handleSeekError)
        
        // Clear timeout when seek completes
        const originalHandleSeeked = handleSeeked
        const wrappedHandleSeeked = () => {
          clearTimeout(seekTimeout)
          originalHandleSeeked()
        }
        
        video.removeEventListener('seeked', handleSeeked)
        video.addEventListener('seeked', wrappedHandleSeeked)
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
      
      // Auto-start extraction after a short delay
      setTimeout(() => {
        console.log('Auto-starting extraction...')
        extractProducts()
      }, 1000)
    }
  }

  const retryVideoLoad = () => {
    if (retryCount < 3) {
      console.log(`Retrying video load (attempt ${retryCount + 1}/3)`)
      setRetryCount(prev => prev + 1)
      setIsVideoLoading(true)
      setVideoError('')
      
      if (videoRef.current) {
        videoRef.current.load()
      }
    }
  }

  const handleVideoError = (e: Event) => {
    const video = e.target as HTMLVideoElement
    const error = video.error
    
    console.error('Video failed to load. Details:', {
      videoUrl,
      retryCount,
      error: error ? {
        code: error.code,
        message: error.message,
        MEDIA_ERR_ABORTED: error.code === 1,
        MEDIA_ERR_NETWORK: error.code === 2,
        MEDIA_ERR_DECODE: error.code === 3,
        MEDIA_ERR_SRC_NOT_SUPPORTED: error.code === 4
      } : 'No error details available',
      videoSrc: video.src,
      networkState: video.networkState,
      readyState: video.readyState
    })
    
    setIsVideoLoading(false)
    
    let errorMessage = 'Failed to load video. '
    
    // Check for CORS error specifically
    if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
      errorMessage = 'Facebook video blocked by CORS policy. Facebook videos cannot be loaded directly in web browsers due to security restrictions. This is expected behavior - the app should have used a sample video instead.'
    } else if (error) {
      switch (error.code) {
        case 1:
          errorMessage += 'Video loading was aborted.'
          break
        case 2:
          errorMessage += 'Network error occurred while loading video. This might be a CORS issue.'
          break
        case 3:
          errorMessage += 'Video format is corrupted or unsupported.'
          break
        case 4:
          errorMessage += 'Video format is not supported by your browser.'
          break
        default:
          errorMessage += 'Unknown error occurred.'
      }
    }
    
    setVideoError(errorMessage)
    
    // For Facebook URLs, don't retry as CORS will always fail
    if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
      console.log('Facebook URL CORS error detected - not retrying as this will always fail')
      alert('Facebook videos cannot be loaded directly due to browser security (CORS) restrictions. Please go back and the system will use a sample video for demonstration.')
      return
    }
    
    // Don't show alert immediately if we can retry
    if (retryCount < 3) {
      console.log('Will attempt retry in 2 seconds...')
      setTimeout(retryVideoLoad, 2000)
    } else {
      alert(errorMessage + ' Maximum retry attempts reached.')
    }
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
      
      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm font-mono">
        <div>DEBUG: videoUrl = &quot;{videoUrl}&quot;</div>
        <div>Loading: {String(isVideoLoading)} | Error: {videoError || 'none'} | Retries: {retryCount}/3</div>
      </div>
      
      {/* Error Display */}
      {videoError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">Video Loading Error</h3>
          <p className="text-red-700 text-sm">{videoError}</p>
          {retryCount < 3 && (
            <button
              onClick={retryVideoLoad}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry Loading ({retryCount}/3)
            </button>
          )}
        </div>
      )}
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Player */}
        <div>
          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls={false}
              preload="metadata"
              crossOrigin="anonymous"
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/mov" />
              Your browser does not support the video tag.
            </video>
            
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

          {/* Auto-extraction status */}
          <div className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-2">
            {isExtracting ? (
              <>
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                Auto-Extracting Screenshots... {Math.round(extractionProgress)}%
              </>
            ) : isVideoLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                Loading video... Extraction will start automatically
              </>
            ) : duration > 0 ? (
              <>
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                Starting auto-extraction...
              </>
            ) : (
              <>
                <Download size={20} />
                Waiting for video to load...
              </>
            )}
          </div>

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