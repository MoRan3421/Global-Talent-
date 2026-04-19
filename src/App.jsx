import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ShoppingCart, User, Gamepad2, TrendingUp, ShieldCheck, Heart, Star, 
  MessageSquare, Filter, Zap, Code, Palette, PenTool, Globe, ChevronRight,
  Download, Apple, Play, Wallet, CreditCard, LayoutDashboard, Settings, LogOut,
  Bell, FileText, PieChart, Percent, Mail, Lock, ShieldAlert, CheckCircle, Printer, Send,
  Briefcase, Activity, Target, Award, Rocket, Box, Database, Clock, RefreshCw, Plus, X
} from 'lucide-react'

// --- Assets --- (Import for Vite)
import techImg from './assets/gigs/tech.png'
import gamingImg from './assets/gigs/gaming.png'
import designImg from './assets/gigs/design.png'

const PLATFORM_FEE_RATE = 0.07 
const MALAYSIA_SST_RATE = 0.08 
const DEVELOPER_EMAIL = "tuantuanxiongmaoyouxizhubo@gmail.com"

// --- Components ---

const GigCard = ({ gig, onBuy }) => (
  <motion.div layoutId={`gig-${gig.id}`} whileHover={{ y: -12, scale: 1.02 }} className="gig-card-v2 glass-premium gradient-border">
    <div className="gig-image-wrapper">
       <img src={gig.image} alt={gig.title} />
       <div className="gig-category-overlay"><span className="badge-glass" style={{ color: 'var(--secondary)' }}>{gig.category}</span></div>
       <div className="gig-heart-btn glass"><Heart size={18} /></div>
    </div>
    <div className="gig-content-v2">
      <div className="seller-row">
         <div className="avatar-sm" style={{ background: 'var(--gradient-talent)' }}>{gig.seller[0]}</div>
         <span className="seller-name">{gig.seller}</span>
         <div style={{ flex: 1 }}></div>
         <div className="rating-pill"><Star size={12} fill="currentColor" /> {gig.rating || 5.0}</div>
      </div>
      <h3 className="gig-title-v2">{gig.title}</h3>
      <div className="gig-footer-v2">
         <div className="price-stack">
            <span className="price-label">Starting At</span>
            <span className="price-value">RM {gig.price.toFixed(2)}</span>
         </div>
         <button className="btn-action-round" onClick={() => onBuy(gig)}><ShoppingCart size={20} /></button>
      </div>
    </div>
  </motion.div>
)

const PostGigModal = ({ onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({ title: '', price: '', category: '编程开发', image: '' })
  return (
    <div className="modal-overlay">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="glass-premium" style={{ width: '450px', padding: '40px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h3>发布您的新服务 (New Gig)</h3>
            <X onClick={onClose} style={{ cursor: 'pointer' }} />
         </div>
         <div className="input-group-v3">
            <label>服务标题</label>
            <input placeholder="例如：高性能 React 系统定制" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
         </div>
         <div className="input-group-v3">
            <label>基本价格 (RM)</label>
            <input type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
         </div>
         <div className="input-group-v3">
            <label>封面图片 URL</label>
            <input placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
         </div>
         <button className="btn-glow-primary" style={{ width: '100%', marginTop: '30px' }} onClick={() => onSave({ ...formData, id: Date.now(), seller: currentUser.name, price: parseFloat(formData.price), rating: 5.0 })}>确认发布</button>
      </motion.div>
    </div>
  )
}

const Navbar = ({ isLoggedIn, currentUser, userRole, setActiveTab, activeTab, setShowLogin, setIsLoggedIn }) => (
  <nav className="nav-bar">
    <div className="logo-section" onClick={() => setActiveTab('marketplace')}>
      <div className="logo-icon"><Rocket size={24} color="white" /></div>
      <div><span className="logo-text">GLOBAL TALENT</span><span className="logo-subtext">CREATED BY TUANTUAN PANDA</span></div>
    </div>
    <div className="nav-menu">
      <a href="#" className={activeTab === 'marketplace' ? 'active' : ''} onClick={() => setActiveTab('marketplace')}><Globe size={18}/> 广场</a>
      <a href="#" className={activeTab === 'download' ? 'active' : ''} onClick={() => setActiveTab('download')}><Download size={18}/> 下载</a>
       {isLoggedIn && userRole === 'developer' && <a href="#" onClick={() => setActiveTab('developer')} className="dev-portal"><Activity size={18}/> 监控</a>}
    </div>
    <div style={{ flex: 1 }}></div>
    {!isLoggedIn ? <button className="btn-glow-primary" onClick={() => setShowLogin(true)}>登录</button> : 
      <div className="user-profile-badge glass" onClick={() => setActiveTab('profile')}>
        <div style={{ textAlign: 'right', marginRight: '10px' }}><h5>{currentUser.name}</h5><small>{userRole.toUpperCase()}</small></div>
        <div className="avatar-md">{currentUser.name[0]}</div>
      </div>
    }
  </nav>
)

const App = () => {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('buyer')
  const [currentUser, setCurrentUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [userGigs, setUserGigs] = useState([])
  const [showInvoice, setShowInvoice] = useState(null)
  const [showPayment, setShowPayment] = useState(null)
  const [showPostGig, setShowPostGig] = useState(false)

  // Initialization & Persistence
  useEffect(() => {
    const saved = localStorage.getItem('global_talent_gigs')
    if (saved) setUserGigs(JSON.parse(saved))
  }, [])

  const handlePostGig = (newGig) => {
    const updated = [...userGigs, newGig]
    setUserGigs(updated)
    localStorage.setItem('global_talent_gigs', JSON.stringify(updated))
    setShowPostGig(false)
  }

  const defaultGigs = [
    { id: 1, title: '企业级 React + Node.js 高性能开发', seller: '团团熊猫 (Tech)', rating: 5.0, price: 4999, category: '编程开发', image: techImg },
    { id: 2, title: '【灵月S1】专业选手级带打服务', seller: '团团熊猫 (Gaming)', rating: 5.0, price: 350, category: '竞技代打', image: gamingImg },
    { id: 3, title: '3A 级 UI/UX 视觉重塑与体验设计', seller: '团团熊猫 (Design)', rating: 5.0, price: 2800, category: '创意设计', image: designImg },
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginEmail === DEVELOPER_EMAIL) {
       setUserRole('developer'); setCurrentUser({ name: '团团熊猫', email: DEVELOPER_EMAIL })
    } else {
       setUserRole('buyer'); setCurrentUser({ name: 'User_' + Math.floor(Math.random()*999), email: loginEmail })
    }
    setIsLoggedIn(true); setShowLogin(false)
  }

  return (
    <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} userRole={userRole} setActiveTab={setActiveTab} activeTab={activeTab} setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn}/>
      
      <main style={{ padding: '120px 0' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' && (
            <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <section className="hero-v3"><div className="hero-v3-inner"><div><h1 className="hero-v3-title">释放才华<br /><span>主宰未来</span></h1><p className="hero-v3-desc">自由职业者的避风港。7% 低提成，马来西亚合规税制。</p></div></div></section>
              <div style={{ padding: '0 5%' }}><div className="grid-container-premium">
                {[...defaultGigs, ...userGigs].map(gig => <GigCard key={gig.id} gig={gig} onBuy={setShowPayment} />)}
              </div></div>
            </motion.div>
          )}
          {activeTab === 'profile' && <div className="page-view" style={{ padding: '20px 5%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                 <div className="glass-premium" style={{ padding: '30px' }}>
                    <div className="avatar-xl">{currentUser.name[0]}</div>
                    <h2 style={{ marginTop: '20px' }}>{currentUser.name}</h2>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                       <button className="btn-glow-primary" onClick={() => setShowPostGig(true)}>发布新 Gig</button>
                    </div>
                 </div>
                 <div className="glass-premium" style={{ padding: '30px' }}><h3>我的交易历史</h3><p style={{ opacity: 0.5 }}>暂无记录</p></div>
              </div>
          </div>}
          {/* Developer & Download simplified for brevity in this Master file */}
        </AnimatePresence>
      </main>

      {showLogin && <div className="modal-overlay"><motion.div className="login-card-v3 glass-premium"><form onSubmit={handleLogin}><h2>统一登录</h2><input placeholder="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /><button type="submit">进入</button></form></motion.div></div>}
      {showPostGig && <PostGigModal onClose={() => setShowPostGig(false)} onSave={handlePostGig} currentUser={currentUser} />}
      {showPayment && <div className="modal-overlay"><div className="checkout-card-v3 glass-premium"><h3>确认购买?</h3><p>{showPayment.title}</p><button onClick={() => { setShowPayment(null); setShowInvoice(showPayment); }}>确认</button><button onClick={() => setShowPayment(null)}>取消</button></div></div>}
      {showInvoice && <div className="modal-overlay" style={{ background: 'white', color: 'black', padding: '100px', width: '800px' }}><h1>INVOICE</h1><p>GT-{Math.random().toString(36).toUpperCase()}</p><h2>{showInvoice.title}</h2><h3>RM {showInvoice.price}</h3><button onClick={() => setShowInvoice(null)}>关闭</button></div>}
      
      <footer style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>© 2026 Global Talent (全球之星). Created by TuanTuan Panda.</footer>
    </div>
  )
}

export default App
