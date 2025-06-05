'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Crop, ZoomIn, ZoomOut, Save, Undo } from 'lucide-react'

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

interface ProductEditorProps {
  product: ExtractedProduct
  onUpdate: (updatedProduct: ExtractedProduct) => void
  onClose: () => void
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export default function ProductEditor({ product, onUpdate, onClose }: ProductEditorProps) {
  const [name, setName] = useState(product.name || '')
  const [price, setPrice] = useState(product.price?.toString() || '')
  const [description, setDescription] = useState(product.description || '')
  const [quantity, setQuantity] = useState(product.quantity?.toString() || '1')
  
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [originalImageUrl] = useState(product.imageUrl)
  const [croppedImageUrl, setCroppedImageUrl] = useState(product.croppedImageUrl || product.imageUrl)
  
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const cropImage = useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    
    if (!image || !canvas || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get the actual image dimensions
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight
    
    // Get the displayed image dimensions (for future use)
    // const displayWidth = image.clientWidth
    // const displayHeight = image.clientHeight
    
    // Calculate scale factors (for future use)
    // const scaleX = naturalWidth / displayWidth
    // const scaleY = naturalHeight / displayHeight
    
    // Calculate crop area in natural image coordinates
    const cropX = (cropArea.x / 100) * naturalWidth
    const cropY = (cropArea.y / 100) * naturalHeight
    const cropWidth = (cropArea.width / 100) * naturalWidth
    const cropHeight = (cropArea.height / 100) * naturalHeight
    
    // Set canvas size to crop size
    canvas.width = cropWidth
    canvas.height = cropHeight
    
    // Draw cropped image
    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    // Convert to blob URL
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCroppedImageUrl(croppedUrl)
  }, [cropArea, imageLoaded])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, x - prev.width / 2)),
      y: Math.max(0, Math.min(100 - prev.height, y - prev.height / 2))
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const adjustCropSize = (delta: number) => {
    setCropArea(prev => {
      const newWidth = Math.max(20, Math.min(100, prev.width + delta))
      const newHeight = Math.max(20, Math.min(100, prev.height + delta))
      return {
        ...prev,
        width: newWidth,
        height: newHeight,
        x: Math.max(0, Math.min(100 - newWidth, prev.x)),
        y: Math.max(0, Math.min(100 - newHeight, prev.y))
      }
    })
  }

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, width: 100, height: 100 })
    setCroppedImageUrl(originalImageUrl)
  }

  const handleSave = () => {
    cropImage()
    
    const updatedProduct: ExtractedProduct = {
      ...product,
      name: name.trim(),
      price: price ? parseFloat(price) : undefined,
      description: description.trim(),
      quantity: quantity ? parseInt(quantity) : 1,
      croppedImageUrl,
      isProcessed: true
    }
    
    onUpdate(updatedProduct)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image Cropping Area */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Crop Image</h4>
        <div
          ref={containerRef}
          className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={originalImageUrl}
            alt="Product to crop"
            className="w-full h-48 object-contain"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Crop Overlay */}
          <div
            className="absolute border-2 border-purple-500 bg-purple-500 bg-opacity-20"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`,
            }}
          >
            <div className="absolute inset-0 border border-white border-dashed"></div>
          </div>
        </div>

        {/* Crop Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustCropSize(-10)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => adjustCropSize(10)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={resetCrop}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Undo size={16} />
            </button>
          </div>
          
          <button
            onClick={cropImage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Crop size={16} />
            Apply Crop
          </button>
        </div>
      </div>

      {/* Cropped Preview */}
      {croppedImageUrl !== originalImageUrl && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Cropped Preview</h4>
          <div className="w-32 h-32 mx-auto border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={croppedImageUrl}
              alt="Cropped preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Product Details Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            <strong>Timestamp:</strong> {Math.floor(product.timestamp)} seconds into video
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Product
        </button>
      </div>

      {/* Hidden Canvas for Cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}