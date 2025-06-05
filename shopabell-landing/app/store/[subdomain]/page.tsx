'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import StoreHeader from '@/components/storefront/StoreHeader'
import ProductGrid from '@/components/storefront/ProductGrid'
import SellerInfo from '@/components/storefront/SellerInfo'
import Cart from '@/components/storefront/Cart'
import { ShoppingCart, Grid3X3, List, Search } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  inStock: boolean
  timestamp?: number
  uploadedAt?: string
}

interface StoreData {
  businessName: string
  category: string
  description: string
  whatsapp: string
  upiId: string
  theme: string
  products: Product[]
}

interface CartItem extends Product {
  quantity: number
}

// Mock data - In production, this would come from a database
const mockStoreData: Record<string, StoreData> = {
  'trendy-fashion-x5k9j': {
    businessName: 'Trendy Fashion',
    category: 'Fashion',
    description: 'Your one-stop shop for the latest fashion trends',
    whatsapp: '9876543210',
    upiId: 'trendyfashion@paytm',
    theme: 'purple',
    products: [
      {
        id: 1,
        name: 'Designer Kurti Set',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        description: 'Elegant cotton kurti with matching dupatta',
        inStock: true
      },
      {
        id: 2,
        name: 'Silk Saree',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        description: 'Pure silk saree with golden border',
        inStock: true
      },
      {
        id: 3,
        name: 'Casual Jeans',
        price: 999,
        image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400',
        description: 'Comfortable slim-fit denim jeans',
        inStock: true
      },
      {
        id: 4,
        name: 'Party Dress',
        price: 2199,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        description: 'Elegant evening dress for special occasions',
        inStock: false
      }
    ]
  }
}

export default function StorefrontPage() {
  const params = useParams()
  const subdomain = params.subdomain as string
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading store data
    setTimeout(() => {
      // In production, fetch data based on subdomain
      const data = mockStoreData['trendy-fashion-x5k9j']
      
      // Load products uploaded from livestream converter
      const livestreamProducts = JSON.parse(localStorage.getItem('livestream-products') || '[]')
      console.log('Loading livestream products:', livestreamProducts)
      
      // Combine mock products with livestream products
      const combinedProducts = [...data.products, ...livestreamProducts]
      
      setStoreData({
        ...data,
        products: combinedProducts
      })
      setLoading(false)
    }, 500)

    // Check for new livestream products every 5 seconds
    const interval = setInterval(() => {
      const livestreamProducts = JSON.parse(localStorage.getItem('livestream-products') || '[]')
      if (livestreamProducts.length > 0) {
        console.log('Found new livestream products, updating store...')
        setStoreData(prev => {
          if (!prev) return prev
          const mockProducts = mockStoreData['trendy-fashion-x5k9j'].products
          return {
            ...prev,
            products: [...mockProducts, ...livestreamProducts]
          }
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [subdomain])

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const filteredProducts = storeData?.products?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600">This store doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader 
        storeName={storeData.businessName}
        category={storeData.category}
        theme={storeData.theme}
      />

      {/* Search and Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600'} rounded-l-lg transition-colors`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600'} rounded-r-lg transition-colors`}
              >
                <List size={20} />
              </button>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Livestream Products Notice */}
        {storeData.products.some((p: Product) => p.uploadedAt) && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">🔴 Live from Livestream!</h3>
            <p className="text-green-700 text-sm">
              {storeData.products.filter((p: Product) => p.uploadedAt).length} products just added from our live video stream
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              viewMode={viewMode}
              onAddToCart={addToCart}
            />
          </div>

          <div className="lg:col-span-1">
            <SellerInfo
              businessName={storeData.businessName}
              category={storeData.category}
              whatsapp={storeData.whatsapp}
              description={storeData.description}
            />
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        sellerWhatsapp={storeData.whatsapp}
        sellerUpi={storeData.upiId}
      />
    </div>
  )
}