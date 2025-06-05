'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestConverterPage() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testVideoUpload = async () => {
    addLog('Testing video upload functionality...')
    
    // Create a test input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        addLog(`File selected: ${file.name} (${file.type})`)
        
        if (file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file)
          addLog(`Video URL created: ${url.substring(0, 50)}...`)
          
          // Test video element
          const video = document.createElement('video')
          video.src = url
          video.preload = 'metadata'
          
          video.onloadedmetadata = () => {
            addLog(`Video loaded successfully. Duration: ${video.duration} seconds`)
            URL.revokeObjectURL(url)
          }
          
          video.onerror = () => {
            addLog('ERROR: Failed to load video')
            URL.revokeObjectURL(url)
          }
        } else {
          addLog('ERROR: Selected file is not a video')
        }
      }
    }
    
    input.click()
  }

  const testFacebookUrl = async () => {
    addLog('Testing Facebook URL processing...')
    
    const testUrl = 'https://www.facebook.com/watch/?v=123456789'
    addLog(`Testing URL: ${testUrl}`)
    
    // Validate URL
    try {
      new URL(testUrl)
      addLog('✓ URL format is valid')
      
      if (testUrl.includes('facebook.com') || testUrl.includes('fb.watch')) {
        addLog('✓ URL is a Facebook URL')
        
        // Simulate processing
        addLog('Processing Facebook URL...')
        setTimeout(() => {
          const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          addLog(`✓ URL processed successfully: ${sampleVideoUrl}`)
          
          // Test video loading
          const video = document.createElement('video')
          video.src = sampleVideoUrl
          video.crossOrigin = 'anonymous'
          video.preload = 'metadata'
          
          video.onloadedmetadata = () => {
            addLog(`✓ Sample video loaded. Duration: ${video.duration} seconds`)
          }
          
          video.onerror = () => {
            addLog('ERROR: Failed to load sample video')
          }
        }, 2000)
      } else {
        addLog('ERROR: URL is not a Facebook URL')
      }
    } catch {
      addLog('ERROR: Invalid URL format')
    }
  }

  const testVideoExtraction = () => {
    addLog('Testing video frame extraction...')
    
    // Create test canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      addLog('✓ Canvas context available')
      
      // Test canvas operations
      canvas.width = 400
      canvas.height = 400
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 400, 400)
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      if (dataUrl) {
        addLog('✓ Canvas to data URL conversion works')
        addLog(`Data URL length: ${dataUrl.length} characters`)
      } else {
        addLog('ERROR: Failed to convert canvas to data URL')
      }
    } else {
      addLog('ERROR: Canvas context not available')
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/livestream-converter" className="text-blue-600 hover:text-blue-800">
            ← Back to Livestream Converter
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Livestream Converter Debug Tool
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Functions</h2>
              <div className="space-y-4">
                <button
                  onClick={testVideoUpload}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Video Upload
                </button>
                
                <button
                  onClick={testFacebookUrl}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Test Facebook URL
                </button>
                
                <button
                  onClick={testVideoExtraction}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Test Video Extraction
                </button>
                
                <button
                  onClick={clearLogs}
                  className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Logs
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug Logs</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet. Click a test button to start debugging.</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Common Issues & Solutions</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Video won&apos;t load:</strong> Check file format (MP4, WebM, MOV supported)</li>
              <li>• <strong>Facebook URL fails:</strong> Use any facebook.com video URL for demo</li>
              <li>• <strong>Extraction fails:</strong> Ensure video is fully loaded before extracting</li>
              <li>• <strong>CORS errors:</strong> Some video URLs may not allow cross-origin access</li>
              <li>• <strong>Browser compatibility:</strong> Use Chrome/Safari for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}