import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ShoppingCart, User, Gamepad2, TrendingUp, ShieldCheck, Heart, Star, 
  MessageSquare, Filter, Zap, Code, Palette, PenTool, Globe, ChevronRight,
  Download, Apple, Play, Wallet, CreditCard, LayoutDashboard, Settings, LogOut,
  Bell, FileText, PieChart, Percent, Mail, Lock, ShieldAlert, CheckCircle, Printer, Send
} from 'lucide-react'

// Constants
const PLATFORM_FEE_RATE = 0.07 // Updated to 7%
const MALAYSIA_SST_RATE = 0.08 // Malaysia Service Tax 8%
const DEVELOPER_EMAIL = "tuantuanxiongmaoyouxizhubo@gmail.com"

// --- Modular Components (Moved outside App to avoid re-mounting on state change) ---

const GigCard = ({ gig }) => {
  const commission = gig.price * PLATFORM_FEE_RATE
  const sst = gig.price * MALAYSIA_SST_RATE
  const takeHome = gig.price - commission - sst

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="gig-card glass"
    >
      <div style={{ position: 'relative' }}>
         <img src={gig.image} alt={gig.title} className="gig-image" />
         <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
           <span className="category-tag" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>{gig.category}</span>
         </div>
      </div>
      <div className="gig-info">
        <div className="gig-header">
           <div className="avatar" style={{ background: 'var(--gradient-talent)' }}>{gig.seller[0]}</div>
           <div style={{ flex: 1 }}>
             <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{gig.seller}</div>
           </div>
           <Heart size={18} color="#94a3b8" />
        </div>
        <h3 style={{ fontSize: '1rem', height: '3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '12px' }}>
          {gig.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
           <Star size={14} fill="#f59e0b" color="#f59e0b" />
           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{gig.rating}</span>
           <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({gig.reviews})</span>
        </div>
        <div className="tax-summary" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
             <span>平台提成 (7%)</span>
             <span>-RM {commission.toFixed(2)}</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span>马代缴税额 (8%)</span>
             <span>-RM {sst.toFixed(2)}</span>
           </div>
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>预计收入 RM {takeHome.toFixed(2)}</div>
           <div className="price-tag" style={{ fontSize: '1.2rem' }}>RM {gig.price}</div>
        </div>
      </div>
    </motion.div>
  )
}

const Navbar = ({ isLoggedIn, currentUser, userRole, setActiveTab, activeTab, setShowLogin, setIsLoggedIn }) => (
  <nav className="nav-bar scrolled shadow-lg">
    <div className="logo" onClick={() => setActiveTab('marketplace')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div style={{ width: '40px', height: '40px', background: 'var(--gradient-talent)', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
        <Globe size={24} color="white" />
      </div>
      <span className="logo-text">GLOBAL TALENT</span>
      <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>全球之星</span>
    </div>

    <div className="nav-links" style={{ display: 'flex', gap: '24px', marginLeft: '40px' }}>
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('marketplace'); }} className={activeTab === 'marketplace' ? 'active' : ''}>探索</a>
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('download'); }} className={activeTab === 'download' ? 'active' : ''}>客户端</a>
      {isLoggedIn && userRole === 'developer' && (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('developer'); }} style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>开发者中心</a>
      )}
    </div>

    <div style={{ flex: 1 }}></div>

    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      {!isLoggedIn ? (
        <button className="btn-primary" onClick={() => setShowLogin(true)}>登录 / 注册</button>
      ) : (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer', textAlign: 'right' }}>
             <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</div>
             <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userRole.toUpperCase()}</div>
          </div>
          <div className="avatar" style={{ background: 'var(--gradient-talent)', width: '35px', height: '35px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>{currentUser.name[0]}</div>
          <LogOut size={20} cursor="pointer" onClick={() => { setIsLoggedIn(false); setActiveTab('marketplace') }} />
        </div>
      )}
    </div>
  </nav>
)

const LoginModal = ({ loginEmail, setLoginEmail, handleLogin, setShowLogin }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'grid', placeItems: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '60px', height: '60px', background: 'var(--gradient-talent)', borderRadius: '15px', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <Lock size={30} color="white" />
        </div>
        <h2 style={{ fontSize: '1.5rem' }}>欢迎来到全球之星</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>由自由职业者为自由职业者打造</p>
      </div>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>电子邮箱</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
            <Mail size={18} color="var(--primary)" />
            <input 
              required
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="请输入您的 Gmail..." 
              style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '100%' }}
            />
          </div>
          {loginEmail === DEVELOPER_EMAIL && <p style={{ color: 'var(--secondary)', fontSize: '0.7rem', marginTop: '5px' }}><ShieldAlert size={12} /> 检测到开发者帐号权限</p>}
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>密码</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
            <Lock size={18} color="var(--primary)" />
            <input type="password" placeholder="••••••••" style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>进入平台</button>
        <button type="button" onClick={() => setShowLogin(false)} style={{ width: '100%', padding: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '10px' }}>暂不登录</button>
      </form>
    </motion.div>
  </div>
)

const InvoiceModal = ({ gig, isStripe, currentUser, setShowInvoice }) => {
  if (!gig) return null
  const subtotal = gig.price
  const platformFee = subtotal * PLATFORM_FEE_RATE
  const sst = subtotal * MALAYSIA_SST_RATE
  const netAmount = subtotal - platformFee - sst

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 4000, display: 'grid', placeItems: 'center', padding: '20px', backdropFilter: 'blur(20px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: '100%', maxWidth: '800px', background: isStripe ? '#fff' : 'var(--bg-card)', color: isStripe ? '#000' : '#fff', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '40px', background: isStripe ? '#635bff' : 'var(--gradient-talent)', color: '#fff' }}>
           <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>GLOBAL TALENT e-INVOICE</h1>
           <p style={{ opacity: 0.8 }}>Transaction ID: #GT-{Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
        <div style={{ padding: '40px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                 <h4 style={{ opacity: 0.6, fontSize: '0.8rem' }}>BILLED TO</h4>
                 <p style={{ fontWeight: 700 }}>{currentUser?.name || 'Guest'}</p>
                 <p style={{ fontSize: '0.8rem' }}>{currentUser?.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <h4 style={{ opacity: 0.6, fontSize: '0.8rem' }}>DATE</h4>
                 <p style={{ fontWeight: 700 }}>{new Date().toLocaleDateString()}</p>
              </div>
           </div>
           <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                 <span>{gig.title}</span>
                 <span>RM {gig.price.toFixed(2)}</span>
              </div>
           </div>
           <div style={{ width: '250px', marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <span style={{ opacity: 0.6 }}>Platform Fee (7%)</span>
                 <span>-RM {platformFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <span style={{ opacity: 0.6 }}>Tax (SST 8%)</span>
                 <span>-RM {sst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px', fontWeight: 900, fontSize: '1.2rem' }}>
                 <span>Payout</span>
                 <span style={{ color: isStripe ? '#635bff' : 'var(--primary)' }}>RM {netAmount.toFixed(2)}</span>
              </div>
           </div>
           <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn-primary" onClick={() => window.print()}>Print Invoice</button>
              <button className="btn-secondary" onClick={() => setShowInvoice(null)}>Close</button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

const MarketplaceView = ({ isLoggedIn, userRole, setUserRole, setShowPostGig, setShowLogin, userGigs }) => {
  const defaultGigs = [
    { title: '【企业级】React + Node.js 全栈定制开发', seller: 'Tech_Leader', rating: 5.0, reviews: 42, price: 4999, category: '编程开发', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { title: '职业战队规格：灵月S1 赛季百星代打 效率保障', seller: 'King_Pro', rating: 4.9, reviews: 189, price: 350, category: '竞技代打', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e' },
    { title: '顶级 UI/UX 设计 - 3A 游戏界面重写', seller: 'DesignGod', rating: 5.0, reviews: 12, price: 2800, category: 'UI 设计', image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67' },
  ]
  const allGigs = [...defaultGigs, ...userGigs]

  return (
    <div className="shimmer-bg">
      <div style={{ padding: '120px 5% 0' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass" style={{ padding: '80px', background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))', borderRadius: '40px' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>GLOBAL <span style={{ color: 'var(--secondary)' }}>TALENT</span><br/>全球之星</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: '30px 0 50px', maxWidth: '600px' }}>由自由职业者 **团团熊猫** 打造的合规化服务平台。更低提成，更高效率。</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                 {isLoggedIn ? (
                    userRole === 'buyer' ? <button className="btn-primary" onClick={() => setUserRole('seller')}>成为卖家</button> : <button className="btn-primary" onClick={() => setShowPostGig(true)}>+ 发布服务</button>
                 ) : (
                    <button className="btn-primary" onClick={() => setShowLogin(true)}>立即开始</button>
                 )}
              </div>
          </motion.div>
      </div>
      <div style={{ padding: '80px 5%' }}>
         <h2 style={{ marginBottom: '40px' }}>探索顶尖服务</h2>
         <div className="grid-container">
            {allGigs.map((gig, i) => <GigCard key={i} gig={gig} />)}
         </div>
      </div>
    </div>
  )
}

const ProfileView = ({ currentUser, userRole, setUserRole, userGigs, setShowPostGig, setShowInvoice }) => (
  <div className="profile-layout" style={{ padding: '120px 5%' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
       <div className="glass" style={{ padding: '30px', textAlign: 'center', height: 'fit-content' }}>
          <div className="avatar" style={{ width: '80px', height: '80px', margin: '0 auto 20px', fontSize: '2rem' }}>{currentUser?.name?.[0]}</div>
          <h3>{currentUser?.name}</h3>
          <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>{currentUser?.email}</p>
          <div className="badge" style={{ marginTop: '20px', background: 'var(--primary)' }}>{userRole.toUpperCase()}</div>
          {userRole === 'buyer' && <button className="btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setUserRole('seller')}>申请卖家权限</button>}
       </div>
       <div className="glass" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
             <h2>我的仪表盘</h2>
             {userRole === 'seller' && <button className="btn-primary" onClick={() => setShowPostGig(true)}>新建 Gig</button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
             <div className="stat-box glass">
                <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>累计成交</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>RM {userRole === 'seller' ? '12,400' : '0'}</div>
             </div>
             {/* Add more stats... */}
          </div>
       </div>
    </div>
  </div>
)

const DeveloperDashboard = () => (
   <div style={{ padding: '120px 5%' }}>
      <h1>开发者管理终端 <span style={{ color: 'var(--secondary)' }}>GOD MODE</span></h1>
      <p style={{ color: 'var(--text-muted)' }}>欢迎回来 团团熊猫. 系统运行正常.</p>
      <div className="grid-container" style={{ marginTop: '40px' }}>
         <div className="glass" style={{ padding: '30px' }}>
            <h3>营收概览</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>RM 1,248,300</div>
         </div>
         {/* More dashboard items... */}
      </div>
   </div>
)

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('buyer')
  const [currentUser, setCurrentUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [showInvoice, setShowInvoice] = useState(null) 
  const [showPayment, setShowPayment] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [showPostGig, setShowPostGig] = useState(false)
  const [userGigs, setUserGigs] = useState([
    { title: '企业级 CRM 系统开发', price: 4999, category: '编程', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', seller: 'You', rating: 5.0, reviews: 0 }
  ])

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginEmail === DEVELOPER_EMAIL) {
      setUserRole('developer')
      setCurrentUser({ name: '团团熊猫', email: DEVELOPER_EMAIL })
    } else {
      setUserRole('buyer')
      setCurrentUser({ name: 'User_' + loginEmail.split('@')[0], email: loginEmail })
    }
    setIsLoggedIn(true)
    setShowLogin(false)
    setActiveTab(loginEmail === DEVELOPER_EMAIL ? 'developer' : 'marketplace')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser} 
        userRole={userRole} 
        setActiveTab={setActiveTab} 
        activeTab={activeTab}
        setShowLogin={setShowLogin}
        setIsLoggedIn={setIsLoggedIn}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === 'marketplace' && (
          <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MarketplaceView 
              isLoggedIn={isLoggedIn} 
              userRole={userRole} 
              setUserRole={setUserRole} 
              setShowPostGig={setShowPostGig} 
              setShowLogin={setShowLogin} 
              userGigs={userGigs} 
            />
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProfileView 
              currentUser={currentUser} 
              userRole={userRole} 
              setUserRole={setUserRole} 
              userGigs={userGigs} 
              setShowPostGig={setShowPostGig} 
              setShowInvoice={setShowInvoice} 
            />
          </motion.div>
        )}
        {activeTab === 'developer' && (
          <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DeveloperDashboard />
          </motion.div>
        )}
        {activeTab === 'download' && (
          <div style={{ padding: '160px 5%', textAlign: 'center' }}>
            <h1>下载全球之星移动端</h1>
            <p style={{ color: 'var(--text-muted)', margin: '20px 0 40px' }}>支持 iOS 15+ 与 Android 10+.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
               <button className="btn-secondary">App Store</button>
               <button className="btn-secondary">Google Play</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <LoginModal 
            loginEmail={loginEmail} 
            setLoginEmail={setLoginEmail} 
            handleLogin={handleLogin} 
            setShowLogin={setShowLogin} 
          />
        )}
        {showInvoice && (
          <InvoiceModal 
            gig={showInvoice} 
            isStripe={paymentMethod === 'stripe'} 
            currentUser={currentUser} 
            setShowInvoice={setShowInvoice} 
          />
        )}
        {/* PaymentModal and PostGigModal would follow the same pattern... */}
      </AnimatePresence>

      <footer className="footer" style={{ marginTop: '100px', padding: '60px 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
         <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>
            © 2026 GLOBAL TALENT (全球之星). 版权所有.
            <br />
            由自由职业者 团团熊猫 (TuanTuan Panda) 专为自由职业者打造.
         </div>
      </footer>
    </div>
  )
}

export default App
