'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Mic, MicOff } from 'lucide-react'

// Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

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
  const [isListening, setIsListening] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null)
  const [lastCaptureTime, setLastCaptureTime] = useState(0)

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

  const captureProductScreenshot = useCallback(() => {
    if (!videoRef.current || !isExtracting) return

    const currentVideoTime = videoRef.current.currentTime
    
    // Prevent capturing multiple screenshots too quickly
    if (currentVideoTime - lastCaptureTime < 1) {
      console.log('Skipping capture - too soon after last capture')
      return
    }

    const imageUrl = captureFrame()
    
    if (imageUrl) {
      const product: ExtractedProduct = {
        id: `product_${currentVideoTime}_${Date.now()}`,
        timestamp: currentVideoTime,
        imageUrl,
        isProcessed: false
      }
      
      const updatedProducts = [...extractedProducts, product]
      setExtractedProducts(updatedProducts)
      onProductsExtracted(updatedProducts)
      setLastCaptureTime(currentVideoTime)
      
      // Update progress based on video position
      const progress = (currentVideoTime / duration) * 100
      setExtractionProgress(progress)
      onProgress(progress)
      
      console.log(`✓ Captured product at ${currentVideoTime.toFixed(1)}s via voice command`)
    }
  }, [isExtracting, lastCaptureTime, extractedProducts, duration, onProductsExtracted, onProgress])

  const initializeSpeechRecognition = () => {
    // Check if Web Speech API is available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser')
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1
      const transcript = event.results[last][0].transcript.toLowerCase()

      // Check if the word "next" was spoken
      if (transcript.includes('next') && event.results[last].isFinal) {
        console.log('Voice command "next" detected')
        captureProductScreenshot()
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // Restart recognition if no speech detected
        setTimeout(() => {
          if (isListening && recognition) {
            try {
              recognition.start()
            } catch {
              console.log('Recognition already started')
            }
          }
        }, 1000)
      }
    }

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListening) {
        try {
          recognition.start()
        } catch {
          console.log('Recognition already started')
        }
      }
    }

    return recognition
  }

  const startVoiceExtraction = () => {
    if (!videoRef.current) {
      console.error('Video element not found')
      return
    }

    const videoDuration = videoRef.current.duration
    console.log('Starting voice-activated extraction. Duration:', videoDuration)

    if (!videoDuration || videoDuration === 0 || isNaN(videoDuration) || !isFinite(videoDuration)) {
      console.error('Video duration not available')
      alert('Please wait for the video to load completely before extracting products.')
      return
    }

    setIsExtracting(true)
    setExtractionProgress(0)
    setExtractedProducts([])
    setLastCaptureTime(0)
    
    // Initialize speech recognition
    const recognition = initializeSpeechRecognition()
    if (!recognition) return

    setSpeechRecognition(recognition)
    setIsListening(true)
    
    try {
      recognition.start()
      console.log('Voice recognition started. Say "next" to capture products.')
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      alert('Failed to start voice recognition. Please check microphone permissions.')
      setIsExtracting(false)
      setIsListening(false)
    }
  }

  const stopVoiceExtraction = () => {
    if (speechRecognition) {
      setIsListening(false)
      speechRecognition.stop()
      setSpeechRecognition(null)
    }
    
    setIsExtracting(false)
    
    if (extractedProducts.length > 0) {
      setExtractionProgress(100)
      onProgress(100)
    }
    
    console.log(`Voice extraction stopped. Captured ${extractedProducts.length} products.`)
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
      
      // Auto-start voice extraction after a short delay
      setTimeout(() => {
        console.log('Auto-starting voice extraction...')
        startVoiceExtraction()
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
        
        // Clean up speech recognition
        if (speechRecognition) {
          speechRecognition.stop()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update speech recognition when extractedProducts changes
  useEffect(() => {
    if (speechRecognition && speechRecognition.onresult) {
      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1
        const transcript = event.results[last][0].transcript.toLowerCase()

        if (transcript.includes('next') && event.results[last].isFinal) {
          console.log('Voice command "next" detected')
          captureProductScreenshot()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedProducts, speechRecognition])

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

          {/* Voice control status */}
          <div className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              {isListening ? (
                <>
                  <Mic size={20} className="text-red-600 animate-pulse" />
                  <span className="font-semibold">Voice Control Active</span>
                  <button
                    onClick={stopVoiceExtraction}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Stop
                  </button>
                </>
              ) : isExtracting ? (
                <>
                  <MicOff size={20} className="text-gray-400" />
                  <span>Initializing voice control...</span>
                </>
              ) : isVideoLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading video... Voice control will start automatically</span>
                </>
              ) : (
                <>
                  <MicOff size={20} className="text-gray-400" />
                  <span>Voice control inactive</span>
                  <button
                    onClick={startVoiceExtraction}
                    className="ml-4 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                  >
                    Start
                  </button>
                </>
              )}
            </div>
            {isListening && (
              <div className="mt-2 text-center text-sm">
                <p className="text-purple-600 font-medium">Say &quot;NEXT&quot; to capture a product screenshot</p>
                <p className="text-gray-500 mt-1">Products captured: {extractedProducts.length}</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isExtracting && extractedProducts.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Video progress</span>
                <span>{Math.round(extractionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-purple-600 text-center">
                <span>Voice-activated capture mode</span>
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
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Screenshots will appear here when you say &quot;NEXT&quot;</p>
              <p className="text-sm mt-1">Voice control will start automatically</p>
            </div>
          )}

          {extractedProducts.length > 0 && !isExtracting && !isListening && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Captured {extractedProducts.length} product screenshots via voice
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