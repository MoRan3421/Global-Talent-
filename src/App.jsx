import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ShoppingCart, User, Gamepad2, TrendingUp, ShieldCheck, Heart, Star, 
  MessageSquare, Filter, Zap, Code, Palette, PenTool, Globe, ChevronRight,
  Download, Apple, Play, Wallet, CreditCard, LayoutDashboard, Settings, LogOut,
  Bell, FileText, PieChart, Percent, Mail, Lock, ShieldAlert, CheckCircle, Printer, Send,
  Briefcase, Activity, Target, Award, Rocket, Box, Database, Clock, RefreshCw, Plus, X,
  MoreVertical, MapPin, Clock3, CheckCircle2, AlertCircle, Bookmark, Share2, Flag,
  ChevronLeft, Edit3, Trash2, Camera, Link, Calendar,
  Loader2, Sparkles, Users, DollarSign, BarChart3,
  Upload, Image as ImageIcon, Menu, XCircle, Eye
} from 'lucide-react'

// --- Firebase ---
import {
  auth, db, onAuthStateChanged, signInWithGoogle, signInWithEmail, signUpWithEmail,
  logoutUser, createUserProfile, getUserProfile, createGig, getGigs, createOrder,
  uploadImage
} from './firebase'

// --- Assets --- (Import for Vite)
import techImg from './assets/gigs/tech.png'
import gamingImg from './assets/gigs/gaming.png'
import designImg from './assets/gigs/design.png'

const PLATFORM_FEE_RATE = 0.07 
const MALAYSIA_SST_RATE = 0.08 
const DEVELOPER_EMAIL = "tuantuanxiongmaoyouxizhubo@gmail.com"

// --- Categories ---
const CATEGORIES = [
  { id: 'all', name: '全部', icon: Globe },
  { id: 'programming', name: '编程开发', icon: Code },
  { id: 'design', name: '创意设计', icon: Palette },
  { id: 'gaming', name: '游戏服务', icon: Gamepad2 },
  { id: 'writing', name: '写作翻译', icon: PenTool },
  { id: 'marketing', name: '数字营销', icon: TrendingUp },
  { id: 'data', name: '数据处理', icon: Database },
  { id: 'video', name: '视频动画', icon: Activity },
  { id: 'music', name: '音乐音频', icon: Zap },
  { id: 'business', name: '商务服务', icon: Briefcase },
  { id: 'ai', name: 'AI服务', icon: Sparkles },
]

// --- Mock Data ---
const MOCK_USERS = [
  { id: 1, name: '团团熊猫', email: DEVELOPER_EMAIL, role: 'developer', avatar: null, skills: ['React', 'Node.js', 'Firebase'], bio: '全栈开发者，专注于高性能Web应用开发', location: '马来西亚', memberSince: '2024-01', completedOrders: 156, rating: 4.9 },
  { id: 2, name: '小明设计', email: 'designer@example.com', role: 'seller', avatar: null, skills: ['UI/UX', 'Figma', '品牌设计'], bio: '专业UI/UX设计师，5年经验', location: '中国', memberSince: '2024-03', completedOrders: 89, rating: 4.8 },
  { id: 3, name: '游戏大神', email: 'gamer@example.com', role: 'seller', avatar: null, skills: ['王者荣耀', '英雄联盟', '代练'], bio: '专业代练，快速上分', location: '新加坡', memberSince: '2024-02', completedOrders: 234, rating: 4.9 },
]

const MOCK_REVIEWS = [
  { id: 1, user: '客户A', rating: 5, comment: '非常满意！交付速度快，质量高', date: '2024-12-01', gigId: 1 },
  { id: 2, user: '客户B', rating: 5, comment: '专业的服务，推荐！', date: '2024-11-28', gigId: 1 },
  { id: 3, user: '客户C', rating: 4, comment: '不错，但还可以更好', date: '2024-11-25', gigId: 2 },
]

const MOCK_ORDERS = [
  { id: 'ORD-001', gigId: 1, seller: '团团熊猫', buyer: '客户A', status: 'completed', price: 4999, date: '2024-12-01', deadline: '2024-12-15' },
  { id: 'ORD-002', gigId: 2, seller: '团团熊猫', buyer: '客户B', status: 'in_progress', price: 350, date: '2024-12-10', deadline: '2024-12-12' },
  { id: 'ORD-003', gigId: 3, seller: '小明设计', buyer: '当前用户', status: 'pending', price: 2800, date: '2024-12-15', deadline: '2024-12-20' },
]

const MOCK_MESSAGES = [
  { id: 1, from: '团团熊猫', to: '当前用户', content: '你好！请问有什么可以帮你的？', time: '10:30', unread: false },
  { id: 2, from: '当前用户', to: '团团熊猫', content: '我想了解一下你的React开发服务', time: '10:35', unread: false },
  { id: 3, from: '团团熊猫', to: '当前用户', content: '没问题！我可以为你定制高性能的React应用', time: '10:40', unread: true },
]

// --- Helper Components ---

const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-lg', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' }
  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white`}>
      {name?.[0] || '?'}
    </div>
  )
}

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-white',
    primary: 'bg-indigo-500 text-white',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    outline: 'border border-white/20 text-white/80'
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// --- Gig Card Component ---
const GigCard = ({ gig, onBuy, onView, isFavorite, onToggleFavorite }) => (
  <motion.div 
    layoutId={`gig-${gig.id}`} 
    whileHover={{ y: -12, scale: 1.02 }} 
    className="gig-card-v2 glass-premium gradient-border cursor-pointer"
    onClick={() => onView(gig)}
  >
    <div className="gig-image-wrapper">
       <img src={gig.image} alt={gig.title} />
       <div className="gig-category-overlay">
         <Badge variant="primary">{gig.category}</Badge>
       </div>
       <button 
         className="gig-heart-btn glass"
         onClick={(e) => { e.stopPropagation(); onToggleFavorite(gig.id) }}
       >
         <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-pink-500" : ""} />
       </button>
    </div>
    <div className="gig-content-v2">
      <div className="seller-row">
         <Avatar name={gig.seller} size="sm" />
         <span className="seller-name">{gig.seller}</span>
         <div className="flex-1" />
         <div className="rating-pill">
           <Star size={12} fill="currentColor" /> {gig.rating || 5.0}
           <span className="text-white/50 ml-1">({gig.reviewCount || 0})</span>
         </div>
      </div>
      <h3 className="gig-title-v2 line-clamp-2">{gig.title}</h3>
      {gig.tags && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {gig.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs text-white/50">#{tag}</span>
          ))}
        </div>
      )}
      <div className="gig-footer-v2">
         <div className="price-stack">
            <span className="price-label">Starting At</span>
            <span className="price-value">RM {gig.price?.toFixed(2)}</span>
         </div>
         <button 
           className="btn-action-round" 
           onClick={(e) => { e.stopPropagation(); onBuy(gig); }}
         >
           <ShoppingCart size={20} />
         </button>
      </div>
    </div>
  </motion.div>
)

// --- Gig Detail Modal ---
const GigDetailModal = ({ gig, onClose, onBuy, onMessage, isFavorite, onToggleFavorite }) => {
  if (!gig) return null
  const packages = gig.packages || [
    { name: '基础版', price: gig.price, description: '标准服务', delivery: '3天', revisions: '2次修改' },
    { name: '标准版', price: Math.round(gig.price * 1.5), description: '优先处理 + 额外功能', delivery: '2天', revisions: '5次修改' },
    { name: '高级版', price: Math.round(gig.price * 2.5), description: 'VIP服务 + 24/7支持', delivery: '1天', revisions: '无限修改' },
  ]
  const [selectedPackage, setSelectedPackage] = useState(0)
  
  return (
    <div className="modal-overlay" style={{ overflow: 'auto', padding: '40px 20px' }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="glass-premium w-full max-w-5xl"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <button onClick={onClose} className="btn-icon"><ChevronLeft size={20} /></button>
          <div className="flex gap-3">
            <button onClick={() => onToggleFavorite(gig.id)} className="btn-icon">
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-pink-500" : ""} />
            </button>
            <button className="btn-icon"><Share2 size={20} /></button>
            <button className="btn-icon"><MoreVertical size={20} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Content */}
          <div className="lg:col-span-2 p-6 space-y-6">
            <img src={gig.image} alt={gig.title} className="w-full h-64 object-cover rounded-2xl" />
            <h1 className="text-2xl font-bold">{gig.title}</h1>
            
            {/* Seller Info */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <Avatar name={gig.seller} size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold">{gig.seller}</h3>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span>{gig.rating || 5.0} ({gig.reviewCount || 0} 评价)</span>
                  <span>|</span>
                  <span>156 订单完成</span>
                </div>
              </div>
              <button onClick={() => onMessage(gig.seller)} className="btn-glass flex items-center gap-2">
                <MessageSquare size={16} /> 联系卖家
              </button>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">关于此服务</h3>
              <p className="text-white/70 leading-relaxed">
                {gig.description || '这是一个高质量的专业服务。我会根据您的需求提供最佳解决方案，确保您满意。'}
              </p>
            </div>
            
            {/* Tags */}
            {gig.tags && (
              <div className="flex gap-2 flex-wrap">
                {gig.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
            
            {/* Reviews */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-semibold mb-4">客户评价</h3>
              <div className="space-y-4">
                {MOCK_REVIEWS.filter(r => r.gigId === gig.id).map(review => (
                  <div key={review.id} className="bg-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={review.user} size="sm" />
                      <span className="font-medium">{review.user}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">{review.comment}</p>
                    <p className="text-white/40 text-xs mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Packages */}
          <div className="p-6 bg-white/5 lg:border-l border-white/10">
            <div className="sticky top-6 space-y-4">
              {/* Package Tabs */}
              <div className="flex gap-1 p-1 bg-white/10 rounded-lg">
                {packages.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPackage(i)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedPackage === i ? 'bg-indigo-500 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
              
              {/* Package Details */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-white/60">{packages[selectedPackage].name}</span>
                  <span className="text-3xl font-bold text-indigo-400">RM {packages[selectedPackage].price}</span>
                </div>
                <p className="text-white/70 text-sm">{packages[selectedPackage].description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock3 size={16} /> 交付时间：{packages[selectedPackage].delivery}
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <RefreshCw size={16} /> 修改次数：{packages[selectedPackage].revisions}
                  </div>
                </div>
                
                <button 
                  onClick={() => onBuy({ ...gig, price: packages[selectedPackage].price })}
                  className="btn-glow-primary w-full justify-center"
                >
                  继续 (RM {packages[selectedPackage].price})
                </button>
                <button 
                  onClick={() => onMessage(gig.seller)}
                  className="btn-glass w-full justify-center"
                >
                  联系卖家
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- Messages Modal ---
const MessagesModal = ({ onClose, currentUser }) => {
  const [activeChat, setActiveChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  
  const conversations = [
    { id: 1, name: '团团熊猫', lastMessage: '没问题！我可以为你定制...', time: '10:40', unread: 1 },
    { id: 2, name: '小明设计', lastMessage: '设计稿已发送，请查收', time: '昨天', unread: 0 },
    { id: 3, name: '游戏大神', lastMessage: '代练已完成，请确认', time: '周一', unread: 0 },
  ]
  
  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="glass-premium w-full max-w-4xl h-[80vh] flex overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold">消息</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setActiveChat(conv)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${
                  activeChat?.id === conv.id ? 'bg-white/10' : ''
                }`}
              >
                <Avatar name={conv.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{conv.name}</span>
                    <span className="text-xs text-white/40">{conv.time}</span>
                  </div>
                  <p className="text-sm text-white/50 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-indigo-500 rounded-full text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={activeChat.name} size="sm" />
                  <span className="font-semibold">{activeChat.name}</span>
                </div>
                <button onClick={onClose}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MOCK_MESSAGES.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === '当前用户' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.from === '当前用户' 
                        ? 'bg-indigo-500 text-white rounded-br-none' 
                        : 'bg-white/10 text-white rounded-bl-none'
                    }`}>
                      <p>{msg.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                />
                <button className="btn-glow-primary"><Send size={18} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40">
              选择一个对话开始聊天
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// --- Orders Modal ---
const OrdersModal = ({ onClose, orders, onViewOrder }) => {
  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: '待处理', variant: 'warning' },
      in_progress: { label: '进行中', variant: 'primary' },
      completed: { label: '已完成', variant: 'success' },
      cancelled: { label: '已取消', variant: 'danger' },
    }
    return statuses[status] || { label: status, variant: 'default' }
  }
  
  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="glass-premium w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">我的订单</h2>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {orders.map(order => {
              const status = getStatusBadge(order.status)
              return (
                <div key={order.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onViewOrder(order)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Briefcase className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{order.id}</h4>
                      <p className="text-sm text-white/60">卖家: {order.seller}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <p className="text-lg font-bold text-indigo-400 mt-1">RM {order.price}</p>
                    <p className="text-xs text-white/40">{order.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- Post Gig Modal (Enhanced) ---
const PostGigModal = ({ onClose, onSave, currentUser }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    category: '编程开发',
    price: '',
    image: '',
    description: '',
    tags: '',
    deliveryTime: '3天',
    revisions: '2',
    packages: [
      { name: '基础版', price: '', description: '', delivery: '3天' },
      { name: '标准版', price: '', description: '', delivery: '2天' },
      { name: '高级版', price: '', description: '', delivery: '1天' },
    ]
  })
  
  const handleSubmit = () => {
    onSave({
      ...formData,
      id: Date.now(),
      seller: currentUser.name,
      price: parseFloat(formData.price) || 0,
      rating: 5.0,
      reviewCount: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
  }
  
  return (
    <div className="modal-overlay" style={{ overflow: 'auto' }}>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="glass-premium w-full max-w-2xl my-8">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold">发布新服务</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-white/20'}`} />
            ))}
          </div>
          
          {step === 1 && (
            <>
              <div className="input-group-v3">
                <label className="block text-sm font-medium mb-2">服务标题</label>
                <input 
                  placeholder="例如：高性能 React 系统定制"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="input-group-v3">
                <label className="block text-sm font-medium mb-2">分类</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group-v3">
                <label className="block text-sm font-medium mb-2">标签（用逗号分隔）</label>
                <input 
                  placeholder="例如：React, Web开发, 前端"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button onClick={() => setStep(2)} className="btn-glow-primary w-full">下一步</button>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="input-group-v3">
                <label className="block text-sm font-medium mb-2">服务描述</label>
                <textarea 
                  placeholder="详细描述你的服务内容..."
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="input-group-v3">
                <label className="block text-sm font-medium mb-2">封面图片 URL</label>
                <input 
                  placeholder="https://..."
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-glass flex-1">上一步</button>
                <button onClick={() => setStep(3)} className="btn-glow-primary flex-1">下一步</button>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <h4 className="font-medium mb-4">设置套餐价格</h4>
              {formData.packages.map((pkg, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl mb-3">
                  <h5 className="font-medium mb-3">{pkg.name}</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="价格 (RM)"
                      type="number"
                      value={pkg.price}
                      onChange={e => {
                        const newPackages = [...formData.packages]
                        newPackages[i].price = e.target.value
                        setFormData({...formData, packages: newPackages})
                      }}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                    <input 
                      placeholder="交付时间"
                      value={pkg.delivery}
                      onChange={e => {
                        const newPackages = [...formData.packages]
                        newPackages[i].delivery = e.target.value
                        setFormData({...formData, packages: newPackages})
                      }}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <input 
                    placeholder="套餐描述"
                    value={pkg.description}
                    onChange={e => {
                      const newPackages = [...formData.packages]
                      newPackages[i].description = e.target.value
                      setFormData({...formData, packages: newPackages})
                    }}
                    className="w-full mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-glass flex-1">上一步</button>
                <button onClick={handleSubmit} className="btn-glow-primary flex-1">发布服务</button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// --- Enhanced Navbar ---
const Navbar = ({ isLoggedIn, currentUser, userRole, setActiveTab, activeTab, setShowLogin, showMessages, showOrders, showAdmin, showSellerDashboard, favorites, onSearch }) => (
  <nav className="nav-bar">
    <div className="logo-section" onClick={() => setActiveTab('marketplace')}>
      <div className="logo-icon"><Rocket size={24} color="white" /></div>
      <div><span className="logo-text">GLOBAL TALENT</span><span className="logo-subtext">CREATED BY TUANTUAN PANDA</span></div>
    </div>
    
    {/* Search Bar */}
    <div className="nav-search">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="搜索服务..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
    
    <div className="nav-menu">
      <a href="#" className={activeTab === 'marketplace' ? 'active' : ''} onClick={() => setActiveTab('marketplace')}><Globe size={18}/> 广场</a>
      <a href="#" className={activeTab === 'download' ? 'active' : ''} onClick={() => setActiveTab('download')}><Download size={18}/> 下载</a>
    </div>
    <div style={{ flex: 1 }}></div>
    
    {!isLoggedIn ? (
      <button className="btn-glow-primary" onClick={() => setShowLogin(true)}>登录</button>
    ) : (
      <div className="nav-actions">
        {/* Admin Panel - Only for developer */}
        {userRole === 'developer' && (
          <button className="nav-btn" onClick={showAdmin} title="管理员面板">
            <ShieldCheck size={20} />
          </button>
        )}
        
        {/* Seller Dashboard - For seller and developer */}
        {(userRole === 'seller' || userRole === 'developer') && (
          <button className="nav-btn" onClick={showSellerDashboard} title="卖家工作台">
            <LayoutDashboard size={20} />
          </button>
        )}
        
        {/* Messages */}
        <button className="nav-btn" onClick={showMessages}>
          <MessageSquare size={20} />
          <span className="nav-badge">1</span>
        </button>
        
        {/* Orders */}
        <button className="nav-btn" onClick={showOrders}>
          <Briefcase size={20} />
        </button>
        
        {/* Favorites */}
        <button className="nav-btn" onClick={() => setActiveTab('favorites')}>
          <Heart size={20} />
          {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
        </button>
        
        {/* Profile */}
        <div className="user-profile-badge glass" onClick={() => setActiveTab('profile')}>
          <div style={{ textAlign: 'right', marginRight: '10px' }}>
            <h5 className="text-sm font-semibold">{currentUser?.name}</h5>
            <small className="text-xs text-white/50">{userRole?.toUpperCase()}</small>
          </div>
          <Avatar name={currentUser?.name} size="sm" />
        </div>
      </div>
    )}
  </nav>
)

// --- Category Filter ---
const CategoryFilter = ({ activeCategory, onChange }) => (
  <div className="category-filter">
    <div className="category-scroll">
      {CATEGORIES.map(cat => {
        const Icon = cat.icon
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  </div>
)

// --- Enhanced Profile View ---
const ProfileView = ({ user, gigs, orders, onPostGig, onViewGig, userAvatar, onAvatarUpload }) => {
  const userGigs = gigs.filter(g => g.seller === user.name)
  const completedOrders = orders.filter(o => o.status === 'completed').length
  
  return (
    <div className="page-view" style={{ padding: '20px 5%' }}>
      {/* Profile Header */}
      <div className="glass-premium p-8 mb-8">
        <div className="flex items-start gap-8">
          <AvatarUpload 
            currentAvatar={userAvatar} 
            userName={user.name} 
            onUpload={onAvatarUpload}
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Badge variant="primary">{user.role === 'developer' ? '开发者' : '卖家'}</Badge>
            </div>
            <p className="text-white/70 max-w-2xl mb-4">{user.bio || '暂无个人简介'}</p>
            <div className="flex gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1"><MapPin size={14} /> {user.location || '未知位置'}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> 加入于 {user.memberSince || '2024'}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> 平均响应时间：2小时</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400">{user.rating || 5.0}</div>
            <div className="flex text-yellow-400 justify-center my-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <div className="text-sm text-white/50">({completedOrders} 订单)</div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold">{completedOrders}</div>
            <div className="text-sm text-white/50">已完成订单</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userGigs.length}</div>
            <div className="text-sm text-white/50">发布服务</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99%</div>
            <div className="text-sm text-white/50">准时交付率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-white/50">复购率</div>
          </div>
        </div>
        
        {/* Skills */}
        {user.skills && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-semibold mb-3">技能</h4>
            <div className="flex gap-2 flex-wrap">
              {user.skills.map((skill, i) => (
                <Badge key={i} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* My Gigs */}
      <div className="glass-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">我的服务</h3>
          <button className="btn-glow-primary flex items-center gap-2" onClick={onPostGig}>
            <Plus size={18} /> 发布新服务
          </button>
        </div>
        <div className="grid-container-premium">
          {userGigs.length > 0 ? (
            userGigs.map(gig => (
              <GigCard 
                key={gig.id} 
                gig={gig} 
                onBuy={() => {}} 
                onView={onViewGig}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            ))
          ) : (
            <div className="text-center py-12 text-white/50 col-span-full">
              <Rocket size={48} className="mx-auto mb-4 opacity-50" />
              <p>还没有发布服务，开始创建你的第一个Gig吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Favorites View ---
const FavoritesView = ({ favorites, allGigs, onViewGig, onBuy, isFavorite, onToggleFavorite }) => {
  const favGigs = allGigs.filter(g => favorites.includes(g.id))
  
  return (
    <div className="page-view" style={{ padding: '120px 5%' }}>
      <h1 className="text-3xl font-bold mb-8">我的收藏</h1>
      {favGigs.length > 0 ? (
        <div className="grid-container-premium">
          {favGigs.map(gig => (
            <GigCard 
              key={gig.id} 
              gig={gig} 
              onBuy={onBuy}
              onView={onViewGig}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto mb-4 text-white/30" />
          <p className="text-white/50 text-lg">还没有收藏任何服务</p>
          <p className="text-white/30 mt-2">点击心形图标将喜欢的服务添加到收藏夹</p>
        </div>
      )}
    </div>
  )
}

// --- Loading Screen ---
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#020617] flex items-center justify-center z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 size={48} className="text-indigo-500" />
    </motion.div>
  </div>
)

// --- Seller Dashboard ---
const SellerDashboard = ({ user, orders, gigs, onClose }) => {
  const totalEarnings = orders.filter(o => o.status === 'completed' && o.seller === user.name).reduce((sum, o) => sum + o.price, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' && o.seller === user.name).length
  
  return (
    <div className="page-view" style={{ padding: '100px 5%' }}>
      <div className="glass-premium p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">卖家工作台</h2>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-indigo-400">RM {totalEarnings.toFixed(2)}</div>
            <div className="text-white/60 mt-1">总收入</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-400">{pendingOrders}</div>
            <div className="text-white/60 mt-1">待处理订单</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400">{gigs.length}</div>
            <div className="text-white/60 mt-1">活跃服务</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-pink-400">{user.rating || 5.0}</div>
            <div className="text-white/60 mt-1">评分</div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4">待处理订单</h3>
        <div className="space-y-4">
          {orders.filter(o => o.seller === user.name && o.status === 'pending').length > 0 ? (
            orders.filter(o => o.seller === user.name && o.status === 'pending').map(order => (
              <div key={order.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{order.id}</h4>
                  <p className="text-sm text-white/60">买家: {order.buyer}</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">待处理</Badge>
                  <p className="text-lg font-bold text-indigo-400">RM {order.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/50 text-center py-8">暂无待处理订单</p>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Admin Panel ---
const AdminPanel = ({ users, gigs, orders, onClose }) => {
  const stats = {
    totalUsers: users.length,
    totalGigs: gigs.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
  }
  
  return (
    <div className="page-view" style={{ padding: '100px 5%' }}>
      <div className="glass-premium p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">管理员控制台</h2>
              <p className="text-white/50 text-sm">系统概览与管理</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-indigo-400" />
              <span className="text-white/60">总用户数</span>
            </div>
            <div className="text-3xl font-bold text-indigo-400">{stats.totalUsers}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Box size={20} className="text-green-400" />
              <span className="text-white/60">服务总数</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.totalGigs}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart size={20} className="text-yellow-400" />
              <span className="text-white/60">订单总数</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{stats.totalOrders}</div>
          </div>
        </div>
        
        {/* Revenue & Orders */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-pink-400" />
              <span className="text-white/60">平台总收入</span>
            </div>
            <div className="text-3xl font-bold text-pink-400">RM {stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock3 size={20} className="text-blue-400" />
              <span className="text-white/60">待处理订单</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.pendingOrders}</div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <h3 className="text-xl font-bold mb-4">最近订单</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.slice(0, 10).map(order => (
            <div key={order.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  order.status === 'completed' ? 'bg-green-500' :
                  order.status === 'in_progress' ? 'bg-yellow-500' :
                  order.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h4 className="font-semibold">{order.id}</h4>
                  <p className="text-sm text-white/60">{order.seller} → {order.buyer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-400">RM {order.price}</p>
                <p className="text-xs text-white/40">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Enhanced Orders Modal with Status Update ---
const OrdersModalEnhanced = ({ onClose, orders, currentUser, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all')
  
  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: '待处理', variant: 'warning', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
      in_progress: { label: '进行中', variant: 'primary', color: 'text-blue-400', bg: 'bg-blue-500/20' },
      completed: { label: '已完成', variant: 'success', color: 'text-green-400', bg: 'bg-green-500/20' },
      cancelled: { label: '已取消', variant: 'danger', color: 'text-red-400', bg: 'bg-red-500/20' },
    }
    return statuses[status] || { label: status, variant: 'default', color: 'text-gray-400', bg: 'bg-gray-500/20' }
  }
  
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  
  const canUpdateStatus = (order) => {
    // Seller can update orders they sold, buyer can update orders they bought
    return order.seller === currentUser?.name || order.buyer === currentUser?.name
  }
  
  const handleStatusUpdate = (orderId, newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(orderId, newStatus)
    }
  }
  
  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="glass-premium w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">我的订单</h2>
            <p className="text-white/50 text-sm mt-1">管理你的购买和销售订单</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {[
            { id: 'all', label: '全部', count: orders.length },
            { id: 'pending', label: '待处理', count: orders.filter(o => o.status === 'pending').length },
            { id: 'in_progress', label: '进行中', count: orders.filter(o => o.status === 'in_progress').length },
            { id: 'completed', label: '已完成', count: orders.filter(o => o.status === 'completed').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                filter === tab.id 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Box size={48} className="mx-auto mb-4 text-white/30" />
                <p className="text-white/50">暂无此类订单</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const status = getStatusBadge(order.status)
                const isSeller = order.seller === currentUser?.name
                const isBuyer = order.buyer === currentUser?.name
                
                return (
                  <motion.div 
                    key={order.id} 
                    layout
                    className="bg-white/5 p-5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${status.bg}`}>
                          <Briefcase className={status.color} size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{order.id}</h4>
                            {isSeller && <Badge variant="primary">卖出</Badge>}
                            {isBuyer && <Badge variant="outline">购买</Badge>}
                          </div>
                          <p className="text-sm text-white/60 mt-1">
                            {isSeller ? `买家: ${order.buyer}` : `卖家: ${order.seller}`}
                          </p>
                          <p className="text-xs text-white/40 mt-1">创建时间: {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        <p className="text-xl font-bold text-indigo-400 mt-2">RM {order.price}</p>
                        <p className="text-xs text-white/40">截止: {order.deadline}</p>
                      </div>
                    </div>
                    
                    {/* Status Update Actions */}
                    {canUpdateStatus(order) && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex gap-2 flex-wrap">
                        {order.status === 'pending' && isSeller && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                              className="btn-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              <RefreshCw size={14} className="mr-1" /> 开始处理
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="btn-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              <XCircle size={14} className="mr-1" /> 取消
                            </button>
                          </>
                        )}
                        {order.status === 'in_progress' && isSeller && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="btn-sm bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            <CheckCircle size={14} className="mr-1" /> 标记完成
                          </button>
                        )}
                        {order.status === 'pending' && isBuyer && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="btn-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <XCircle size={14} className="mr-1" /> 取消订单
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- Avatar Upload Component ---
const AvatarUpload = ({ currentAvatar, userName, onUpload }) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = React.useRef(null)
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过 2MB')
      return
    }
    
    setUploading(true)
    try {
      // Create local preview URL
      const localUrl = URL.createObjectURL(file)
      
      // In production, upload to Firebase Storage
      // const downloadUrl = await uploadImage(file, `avatars/${Date.now()}_${file.name}`)
      
      onUpload?.(localUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
        {currentAvatar ? (
          <img src={currentAvatar} alt={userName} className="w-full h-full object-cover" />
        ) : (
          userName?.[0] || '?'
        )}
      </div>
      <button 
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
      </button>
      <input 
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

// --- Main App ---
const App = () => {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('buyer')
  const [currentUser, setCurrentUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userGigs, setUserGigs] = useState([])
  const [showInvoice, setShowInvoice] = useState(null)
  const [showPayment, setShowPayment] = useState(null)
  const [showPostGig, setShowPostGig] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // New states
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('global_talent_favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [showMessages, setShowMessages] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showSellerDashboard, setShowSellerDashboard] = useState(false)
  const [viewingGig, setViewingGig] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [userAvatar, setUserAvatar] = useState(null)

  // Order status update handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  // Avatar upload handler
  const handleAvatarUpload = (avatarUrl) => {
    setUserAvatar(avatarUrl)
    // In production: upload to Firebase and update user profile
  }

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid)
        if (userProfile) {
          setCurrentUser({ ...userProfile, id: user.uid, email: user.email })
          setUserRole(userProfile.role || 'buyer')
          setIsLoggedIn(true)
        } else {
          // Create profile for new user
          const newProfile = {
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email,
            role: user.email === DEVELOPER_EMAIL ? 'developer' : 'buyer',
            bio: '新用户',
            location: '未知',
            memberSince: new Date().toISOString().slice(0, 7),
            completedOrders: 0,
            rating: 5.0,
            skills: []
          }
          await createUserProfile(user.uid, newProfile)
          setCurrentUser({ ...newProfile, id: user.uid, email: user.email })
          setUserRole(newProfile.role)
          setIsLoggedIn(true)
        }
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Initialization & Persistence
  useEffect(() => {
    const saved = localStorage.getItem('global_talent_gigs')
    if (saved) setUserGigs(JSON.parse(saved))
  }, [])

  const handlePostGig = async (newGig) => {
    try {
      // Save to Firebase
      const gigId = await createGig({
        ...newGig,
        sellerId: currentUser?.id,
        seller: currentUser?.name || newGig.seller
      })
      
      // Update local state
      const updated = [...userGigs, { ...newGig, id: gigId }]
      setUserGigs(updated)
      localStorage.setItem('global_talent_gigs', JSON.stringify(updated))
      setShowPostGig(false)
    } catch (error) {
      console.error("Error creating gig:", error)
      // Fallback to local storage only
      const updated = [...userGigs, { ...newGig, id: Date.now().toString() }]
      setUserGigs(updated)
      localStorage.setItem('global_talent_gigs', JSON.stringify(updated))
      setShowPostGig(false)
    }
  }

  const defaultGigs = [
    { id: 'default-1', title: '企业级 React + Node.js 高性能开发', seller: '团团熊猫', rating: 5.0, reviewCount: 23, price: 4999, category: '编程开发', image: techImg, tags: ['React', 'Node.js', '全栈'], description: '专业开发高性能、可扩展的企业级Web应用程序。使用最新的技术栈包括React 18、Node.js、TypeScript。', packages: [{name: '基础版', price: 4999, description: '基础功能开发', delivery: '7天'}, {name: '标准版', price: 7999, description: '完整功能+测试', delivery: '14天'}, {name: '高级版', price: 12999, description: '完整方案+维护', delivery: '30天'}] },
    { id: 'default-2', title: '【灵月S1】专业选手级带打服务', seller: '团团熊猫', rating: 5.0, reviewCount: 156, price: 350, category: '游戏服务', image: gamingImg, tags: ['王者荣耀', '代练', '排位'], description: '专业代练服务，快速上分。支持各段位，保证胜率，安全可靠。', packages: [{name: '青铜到白银', price: 350, description: '快速提升段位', delivery: '1天'}, {name: '白银到黄金', price: 650, description: '稳定上分', delivery: '2天'}, {name: '黄金到铂金', price: 1200, description: '高效代练', delivery: '3天'}] },
    { id: 'default-3', title: '3A 级 UI/UX 视觉重塑与体验设计', seller: '团团熊猫', rating: 5.0, reviewCount: 45, price: 2800, category: '创意设计', image: designImg, tags: ['UI/UX', 'Figma', '设计系统'], description: '打造世界级的用户体验。从用户研究到高保真原型，全流程设计服务。', packages: [{name: '基础设计', price: 2800, description: '5页面设计', delivery: '3天'}, {name: '标准方案', price: 5800, description: '15页面+原型', delivery: '7天'}, {name: '全案设计', price: 12000, description: '全平台设计系统', delivery: '14天'}] },
    { id: 'default-4', title: 'SEO优化与数字营销策略', seller: '团团熊猫', rating: 4.9, reviewCount: 34, price: 1200, category: '数字营销', image: techImg, tags: ['SEO', '营销', '增长'], description: '提升网站排名，增加有机流量。专业的SEO策略和数字营销方案。', packages: [{name: '基础优化', price: 1200, description: '关键词优化', delivery: '7天'}, {name: '增长方案', price: 3500, description: 'SEO+内容策略', delivery: '30天'}, {name: '全案营销', price: 8000, description: '全方位数字营销', delivery: '90天'}] },
    { id: 'default-5', title: '专业文案撰写与内容创作', seller: '团团熊猫', rating: 5.0, reviewCount: 67, price: 500, category: '写作翻译', image: designImg, tags: ['文案', '内容', '创意写作'], description: '专业的商业文案、博客文章、产品描述撰写服务。', packages: [{name: '基础版', price: 500, description: '500字文案', delivery: '1天'}, {name: '标准版', price: 1200, description: '1500字深度文', delivery: '3天'}, {name: '高级版', price: 2500, description: '3000字+SEO优化', delivery: '5天'}] },
    { id: 'default-6', title: '数据分析与可视化报表', seller: '团团熊猫', rating: 4.8, reviewCount: 28, price: 1800, category: '数据处理', image: gamingImg, tags: ['数据分析', 'BI', '报表'], description: '将数据转化为洞察。专业的数据分析服务和可视化报表制作。', packages: [{name: '基础分析', price: 1800, description: '数据清洗+报表', delivery: '3天'}, {name: '深度分析', price: 4500, description: '分析+可视化', delivery: '7天'}, {name: '企业方案', price: 12000, description: 'BI系统搭建', delivery: '30天'}] },
    { id: 'default-7', title: '专业视频剪辑与后期制作', seller: '小明设计', rating: 4.9, reviewCount: 89, price: 800, category: '视频动画', image: designImg, tags: ['视频剪辑', '后期', 'PR'], description: '专业视频剪辑服务，包含调色、字幕、特效等后期制作。', packages: [{name: '短视频', price: 800, description: '1分钟内视频', delivery: '2天'}, {name: '标准视频', price: 2000, description: '5分钟内视频', delivery: '5天'}, {name: '长视频', price: 4500, description: '20分钟内视频', delivery: '10天'}] },
    { id: 'default-8', title: '原创音乐制作与配乐', seller: '游戏大神', rating: 5.0, reviewCount: 42, price: 1500, category: '音乐音频', image: gamingImg, tags: ['音乐', '配乐', '原创'], description: '原创音乐制作，适用于视频配乐、游戏音效、广告音乐等。', packages: [{name: '短音频', price: 1500, description: '30秒音乐', delivery: '3天'}, {name: '标准音乐', price: 3500, description: '3分钟音乐', delivery: '7天'}, {name: '完整作品', price: 8000, description: '专辑制作', delivery: '30天'}] },
    { id: 'default-9', title: 'AI图像生成与修图', seller: '团团熊猫', rating: 4.7, reviewCount: 156, price: 200, category: 'AI服务', image: techImg, tags: ['AI', 'Midjourney', '修图'], description: '使用AI技术生成高质量图像，包含商业修图、背景替换等服务。', packages: [{name: '基础版', price: 200, description: '5张AI图', delivery: '1天'}, {name: '标准版', price: 600, description: '20张+修图', delivery: '3天'}, {name: '商业版', price: 2000, description: '100张+精修', delivery: '7天'}] },
    { id: 'default-10', title: '商业咨询与项目管理', seller: '小明设计', rating: 4.8, reviewCount: 23, price: 5000, category: '商务服务', image: techImg, tags: ['咨询', '项目管理', '商业'], description: '专业的商业咨询服务，包含项目管理、流程优化、战略规划。', packages: [{name: '单次咨询', price: 5000, description: '2小时咨询', delivery: '1天'}, {name: '项目顾问', price: 20000, description: '月度顾问服务', delivery: '30天'}, {name: '企业方案', price: 50000, description: '全案咨询服务', delivery: '90天'}] },
    { id: 'default-11', title: '多语言翻译与本地化', seller: '游戏大神', rating: 4.9, reviewCount: 312, price: 300, category: '写作翻译', image: designImg, tags: ['翻译', '本地化', '多语言'], description: '专业多语言翻译服务，支持中英文互译及小语种翻译。', packages: [{name: '基础翻译', price: 300, description: '500字', delivery: '1天'}, {name: '标准翻译', price: 800, description: '2000字', delivery: '3天'}, {name: '专业翻译', price: 2000, description: '5000字+校对', delivery: '7天'}] },
    { id: 'default-12', title: 'Python自动化脚本开发', seller: '团团熊猫', rating: 5.0, reviewCount: 78, price: 1200, category: '编程开发', image: techImg, tags: ['Python', '自动化', '脚本'], description: '专业Python自动化脚本开发，包含爬虫、数据处理、自动化办公。', packages: [{name: '简单脚本', price: 1200, description: '基础功能', delivery: '2天'}, {name: '复杂脚本', price: 3500, description: '多功能集成', delivery: '5天'}, {name: '系统方案', price: 8000, description: '完整解决方案', delivery: '14天'}] },
  ]

  const allGigs = [...defaultGigs, ...userGigs]
  
  // Filter gigs
  const filteredGigs = allGigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gig.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === 'all' || gig.category === CATEGORIES.find(c => c.id === activeCategory)?.name
    return matchesSearch && matchesCategory
  })

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle()
      setShowLogin(false)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await signUpWithEmail(loginEmail, loginPassword)
      } else {
        await signInWithEmail(loginEmail, loginPassword)
      }
      setShowLogin(false)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) {
      console.error("Email auth error:", error)
      // Fallback to mock login
      const mockUser = MOCK_USERS.find(u => u.email === loginEmail) || { 
        id: Date.now(),
        name: loginEmail.split('@')[0] || 'User_' + Math.floor(Math.random()*999), 
        email: loginEmail,
        role: loginEmail === DEVELOPER_EMAIL ? 'developer' : 'buyer',
        bio: '新用户',
        location: '未知',
        memberSince: new Date().toISOString().slice(0, 7),
        completedOrders: 0,
        rating: 5.0
      }
      setUserRole(mockUser.role)
      setCurrentUser(mockUser)
      setIsLoggedIn(true)
      setShowLogin(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    }
    setIsLoggedIn(false)
    setCurrentUser(null)
    setUserRole('buyer')
    setActiveTab('marketplace')
  }

  const toggleFavorite = (gigId) => {
    const newFavs = favorites.includes(gigId)
      ? favorites.filter(id => id !== gigId)
      : [...favorites, gigId]
    setFavorites(newFavs)
    localStorage.setItem('global_talent_favorites', JSON.stringify(newFavs))
  }

  const handleBuy = (gig) => {
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }
    setShowPayment(gig)
  }

  const handleConfirmPayment = async () => {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      gigId: showPayment.id,
      seller: showPayment.seller,
      sellerId: showPayment.sellerId,
      buyer: currentUser?.name,
      buyerId: currentUser?.id,
      status: 'pending',
      price: showPayment.price,
      date: new Date().toISOString().slice(0, 10),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    }
    
    try {
      await createOrder(newOrder)
    } catch (error) {
      console.error("Order creation error:", error)
    }
    
    setOrders([newOrder, ...orders])
    setShowPayment(null)
    setShowInvoice(showPayment)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="app-container">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser} 
        userRole={userRole} 
        setActiveTab={setActiveTab} 
        activeTab={activeTab} 
        setShowLogin={setShowLogin}
        showMessages={() => setShowMessages(true)}
        showOrders={() => setShowOrders(true)}
        showAdmin={() => setShowAdmin(true)}
        showSellerDashboard={() => setShowSellerDashboard(true)}
        favorites={favorites}
        onSearch={setSearchQuery}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' && (
            <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <section className="hero-v3">
                <div className="hero-v3-inner">
                  <div>
                    <h1 className="hero-v3-title">释放才华<br /><span>主宰未来</span></h1>
                    <p className="hero-v3-desc">自由职业者的避风港。7% 低提成，马来西亚合规税制。</p>
                  </div>
                </div>
              </section>
              
              {/* Category Filter */}
              <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
              
              {/* Results Count */}
              <div className="px-[5%] py-4 text-white/50 text-sm">
                找到 {filteredGigs.length} 个服务
              </div>
              
              <div style={{ padding: '0 5%' }}>
                <div className="grid-container-premium">
                  {filteredGigs.map(gig => (
                    <GigCard 
                      key={gig.id} 
                      gig={gig} 
                      onBuy={handleBuy}
                      onView={setViewingGig}
                      isFavorite={favorites.includes(gig.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
                {filteredGigs.length === 0 && (
                  <div className="text-center py-20">
                    <Search size={64} className="mx-auto mb-4 text-white/30" />
                    <p className="text-white/50">没有找到匹配的服务</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                      className="btn-glow-primary mt-4"
                    >
                      清除筛选
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'profile' && isLoggedIn && (
            <ProfileView 
              user={currentUser} 
              gigs={allGigs}
              orders={orders}
              onPostGig={() => setShowPostGig(true)}
              onViewGig={setViewingGig}
              userAvatar={userAvatar}
              onAvatarUpload={handleAvatarUpload}
            />
          )}
          
          {activeTab === 'favorites' && (
            <FavoritesView 
              favorites={favorites}
              allGigs={allGigs}
              onViewGig={setViewingGig}
              onBuy={handleBuy}
              isFavorite={(id) => favorites.includes(id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          
          {/* Developer & Download tabs - simplified */}
          {activeTab === 'download' && (
            <div className="page-view" style={{ padding: '120px 5%' }}>
              <div className="glass-premium p-8 max-w-2xl mx-auto text-center">
                <Download size={64} className="mx-auto mb-4 text-indigo-400" />
                <h2 className="text-2xl font-bold mb-4">下载 Global Talent App</h2>
                <p className="text-white/70 mb-8">随时随地管理你的订单和服务</p>
                <div className="flex gap-4 justify-center">
                  <button className="btn-glass flex items-center gap-2">
                    <Apple size={20} /> App Store
                  </button>
                  <button className="btn-glass flex items-center gap-2">
                    <Play size={20} /> Google Play
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      {showLogin && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="login-card-v3 glass-premium"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">{isSignUp ? '创建账户' : '欢迎回来'}</h2>
              <p className="text-white/50 mt-2">自由职业者的避风港</p>
            </div>
            
            {/* Google Login */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 mb-4 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 账号{isSignUp ? '注册' : '登录'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0f172a] px-4 text-sm text-white/50">或</span>
              </div>
            </div>
            
            {/* Email Login */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input 
                type="email"
                placeholder="邮箱地址" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                required
              />
              <input 
                type="password"
                placeholder="密码" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" className="btn-glow-primary w-full justify-center">
                {isSignUp ? '注册' : '登录'}
              </button>
            </form>
            
            <p className="text-sm text-white/50 mt-6 text-center">
              {isSignUp ? '已有账户？' : '还没有账户？'}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-indigo-400 hover:text-indigo-300 ml-1 font-medium"
              >
                {isSignUp ? '立即登录' : '立即注册'}
              </button>
            </p>
            
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 btn-icon"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
      
      {viewingGig && (
        <GigDetailModal 
          gig={viewingGig} 
          onClose={() => setViewingGig(null)}
          onBuy={handleBuy}
          onMessage={() => setShowMessages(true)}
          isFavorite={favorites.includes(viewingGig.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      
      {showMessages && (
        <MessagesModal 
          onClose={() => setShowMessages(false)} 
          currentUser={currentUser}
        />
      )}
      
      {showOrders && (
        <OrdersModalEnhanced 
          onClose={() => setShowOrders(false)}
          orders={orders}
          currentUser={currentUser}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
      
      {showAdmin && userRole === 'developer' && (
        <AdminPanel 
          users={MOCK_USERS}
          gigs={allGigs}
          orders={orders}
          onClose={() => setShowAdmin(false)}
        />
      )}
      
      {showSellerDashboard && (
        <SellerDashboard 
          user={currentUser}
          orders={orders}
          gigs={userGigs}
          onClose={() => setShowSellerDashboard(false)}
        />
      )}
      
      {showPostGig && (
        <PostGigModal 
          onClose={() => setShowPostGig(false)} 
          onSave={handlePostGig} 
          currentUser={currentUser} 
        />
      )}
      
      {showPayment && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="checkout-card-v3 glass-premium"
          >
            <h3 className="text-xl font-bold mb-4">确认订单</h3>
            <div className="bg-white/5 p-4 rounded-xl mb-4">
              <p className="font-medium">{showPayment.title}</p>
              <p className="text-2xl font-bold text-indigo-400 mt-2">RM {showPayment.price?.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">平台服务费 (7%)</span>
                <span>RM {(showPayment.price * 0.07).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">SST (8%)</span>
                <span>RM {(showPayment.price * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/10">
                <span>总计</span>
                <span className="text-indigo-400">RM {(showPayment.price * 1.15).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPayment(null)} className="btn-glass flex-1">取消</button>
              <button onClick={handleConfirmPayment} className="btn-glow-primary flex-1">确认支付</button>
            </div>
          </motion.div>
        </div>
      )}
      
      {showInvoice && (
        <div className="modal-overlay" style={{ padding: '40px' }}>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white text-gray-900 rounded-3xl p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-500 mt-1">GT-{Math.random().toString(36).toUpperCase().slice(2, 10)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Rocket size={32} className="text-white" />
              </div>
            </div>
            <div className="border-t border-gray-200 py-6">
              <h2 className="text-xl font-semibold mb-2">{showInvoice.title}</h2>
              <p className="text-gray-600">卖家: {showInvoice.seller}</p>
            </div>
            <div className="border-t border-gray-200 py-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">支付金额</span>
                <span className="text-3xl font-bold text-indigo-600">RM {showInvoice.price?.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowInvoice(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors">
                关闭
              </button>
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> 打印
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <footer style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
        © 2026 Global Talent (全球之星). Created by TuanTuan Panda.
      </footer>
    </div>
  )
}

export default App
