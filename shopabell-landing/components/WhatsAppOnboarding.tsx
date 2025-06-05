'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Check, CheckCheck } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
  time: string
  status?: 'sent' | 'delivered' | 'read'
}

interface UserData {
  businessName: string
  category: string
  upiId: string
  phone: string
}

export default function WhatsAppOnboarding() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Welcome to Shopabell! I'm your setup assistant.",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      text: "Let's get your store ready in just 2 minutes! 🚀",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 3,
      text: "What's your business name?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState<'name' | 'category' | 'upi' | 'phone' | 'complete'>('name')
  const [userData, setUserData] = useState<UserData>({
    businessName: '',
    category: '',
    upiId: '',
    phone: ''
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: sender === 'user' ? 'read' : undefined
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = async () => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    setIsTyping(false)
  }

  const generateStoreUrl = (businessName: string) => {
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `${slug}-${Math.random().toString(36).substr(2, 5)}.shopabell.store`
  }

  const generateCredentials = () => {
    const password = `Shop${Math.random().toString(36).substr(2, 8)}!`
    return password
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Add user message
    addMessage(inputValue, 'user')
    const userInput = inputValue
    setInputValue('')

    // Simulate bot typing
    await simulateTyping()

    // Process based on current step
    switch (currentStep) {
      case 'name':
        setUserData(prev => ({ ...prev, businessName: userInput }))
        addMessage(`Great! "${userInput}" is a wonderful name! 👍`, 'bot')
        await simulateTyping()
        addMessage("What type of products will you sell? (e.g., Fashion, Electronics, Food, Beauty, etc.)", 'bot')
        setCurrentStep('category')
        break

      case 'category':
        setUserData(prev => ({ ...prev, category: userInput }))
        addMessage(`Perfect! ${userInput} is a popular category! 🛍️`, 'bot')
        await simulateTyping()
        addMessage("Now, please enter your UPI ID for receiving payments:", 'bot')
        await simulateTyping()
        addMessage("(Example: yourname@paytm or 9876543210@ybl)", 'bot')
        setCurrentStep('upi')
        break

      case 'upi':
        if (!userInput.includes('@')) {
          addMessage("Please enter a valid UPI ID with @ symbol (e.g., name@paytm)", 'bot')
          return
        }
        setUserData(prev => ({ ...prev, upiId: userInput }))
        addMessage("UPI ID saved securely! 💳✅", 'bot')
        await simulateTyping()
        addMessage("Finally, what's your WhatsApp number? (10 digits)", 'bot')
        setCurrentStep('phone')
        break

      case 'phone':
        if (!/^\d{10}$/.test(userInput)) {
          addMessage("Please enter a valid 10-digit phone number", 'bot')
          return
        }
        const finalUserData = { ...userData, phone: userInput }
        setUserData(finalUserData)
        
        addMessage("🎉 Excellent! Creating your store...", 'bot')
        await simulateTyping()
        
        const storeUrl = generateStoreUrl(finalUserData.businessName)
        const password = generateCredentials()
        
        addMessage("✅ Your store is ready!", 'bot')
        await simulateTyping()
        addMessage(`🏪 Store URL: https://${storeUrl}`, 'bot')
        await simulateTyping()
        addMessage(`📧 Login: ${finalUserData.phone}@shopabell.com`, 'bot')
        await simulateTyping()
        addMessage(`🔐 Password: ${password}`, 'bot')
        await simulateTyping()
        addMessage("📱 Download our app to start selling in minutes!", 'bot')
        await simulateTyping()
        addMessage("Need help? Just type 'HELP' anytime! 😊", 'bot')
        setCurrentStep('complete')
        break

      case 'complete':
        if (userInput.toLowerCase() === 'help') {
          addMessage("Here's what you can do:", 'bot')
          await simulateTyping()
          addMessage("1️⃣ Add products via WhatsApp\n2️⃣ Share store link with customers\n3️⃣ Go live instantly\n4️⃣ Track orders in real-time", 'bot')
        } else {
          addMessage("Your store is all set! Visit your dashboard or type 'HELP' for assistance.", 'bot')
        }
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#075E54] font-bold">S</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Shopabell Setup</h3>
          <p className="text-xs opacity-75">Always active</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        className="h-[500px] overflow-y-auto bg-[#E5DDD5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <div className="p-4 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-[#DCF8C6] rounded-br-none'
                    : 'bg-white rounded-bl-none'
                } shadow-sm`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  {message.sender === 'user' && (
                    <div className="text-blue-500">
                      {message.status === 'read' ? <CheckCheck size={16} /> : <Check size={16} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-3 py-2 rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-3 flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#075E54]"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className="w-10 h-10 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:bg-[#064E46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}