'use client'

interface StoreHeaderProps {
  storeName: string
  category: string
  theme: string
}

export default function StoreHeader({ storeName, category, theme }: StoreHeaderProps) {
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'purple':
        return 'from-purple-600 to-blue-600'
      case 'green':
        return 'from-green-600 to-teal-600'
      case 'orange':
        return 'from-orange-600 to-red-600'
      default:
        return 'from-purple-600 to-blue-600'
    }
  }

  return (
    <header className={`bg-gradient-to-r ${getThemeColors(theme)} text-white py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{storeName}</h1>
            <p className="text-lg opacity-90">{category} • Powered by Shopabell</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Store</span>
          </div>
        </div>
      </div>
    </header>
  )
}