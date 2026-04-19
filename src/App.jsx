import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ShoppingCart, User, Gamepad2, TrendingUp, ShieldCheck, Heart, Star, 
  MessageSquare, Filter, Zap, Code, Palette, PenTool, Globe, ChevronRight,
  Download, Apple, Play, Wallet, CreditCard, LayoutDashboard, Settings, LogOut,
  Bell, FileText, PieChart, Percent, Mail, Lock, ShieldAlert, CheckCircle, Printer, Send,
  Briefcase, Activity, Target, Award, Rocket, Box, Database
} from 'lucide-react'

// Constants
const PLATFORM_FEE_RATE = 0.07 // 7%
const MALAYSIA_SST_RATE = 0.08 // 8% SST
const DEVELOPER_EMAIL = "tuantuanxiongmaoyouxizhubo@gmail.com"

// --- Modular Components (outside App to avoid re-mounting on state change) ---

const GigCard = ({ gig, onBuy }) => {
  const commission = gig.price * PLATFORM_FEE_RATE
  const sst = gig.price * MALAYSIA_SST_RATE
  const takeHome = gig.price - commission - sst

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="gig-card glass interactable"
      style={{ overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', height: '200px' }}>
         <img src={gig.image} alt={gig.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
           <span className="badge-glass">{gig.category}</span>
         </div>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
           <div className="avatar-sm" style={{ background: 'var(--gradient-primary)' }}>{gig.seller[0]}</div>
           <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{gig.seller}</span>
           <div style={{ flex: 1 }}></div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{gig.rating}</span>
           </div>
        </div>
        <h3 className="gig-title-multiline">{gig.title}</h3>
        <div className="stats-mini-list">
           <div className="stat-mini"><span>平台提成</span><span>-{(PLATFORM_FEE_RATE*100)}%</span></div>
           <div className="stat-mini"><span>政府税额</span><span>-{(MALAYSIA_SST_RATE*100)}%</span></div>
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting At</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>RM {gig.price.toFixed(2)}</div>
           </div>
           <button className="btn-buy-mini" onClick={() => onBuy(gig)}>
              <ShoppingCart size={16} />
           </button>
        </div>
      </div>
    </motion.div>
  )
}

const Navbar = ({ isLoggedIn, currentUser, userRole, setActiveTab, activeTab, setShowLogin, setIsLoggedIn }) => (
  <nav className="nav-bar shadow-xl">
    <div className="logo-section" onClick={() => setActiveTab('marketplace')}>
      <div className="logo-icon">
        <Rocket size={24} color="white" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="logo-text">GLOBAL TALENT</span>
        <span className="logo-subtext">全球之星 · 自由职业云</span>
      </div>
    </div>

    <div className="nav-menu">
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('marketplace'); }} className={activeTab === 'marketplace' ? 'nav-item active' : 'nav-item'}>
        <Globe size={18} /> 广场
      </a>
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('download'); }} className={activeTab === 'download' ? 'nav-item active' : 'nav-item'}>
        <Download size={18} /> 下载
      </a>
      {isLoggedIn && userRole === 'developer' && (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('developer'); }} className={activeTab === 'developer' ? 'nav-item dev-portal' : 'nav-item dev-portal'}>
          <Activity size={18} /> 监控
        </a>
      )}
    </div>

    <div style={{ flex: 1 }}></div>

    <div className="user-controls">
      {!isLoggedIn ? (
        <button className="btn-glow-primary" onClick={() => setShowLogin(true)}>
           立即登录 <ChevronRight size={16} />
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="notification-bell glass interactable">
             <Bell size={20} />
             <div className="badge-dot"></div>
          </div>
          <div className="user-profile-badge glass shadow-sm" onClick={() => setActiveTab('profile')}>
             <div className="profile-info text-right">
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>{userRole.toUpperCase()}</div>
             </div>
             <div className="avatar-md shadow-glow">{currentUser.name[0]}</div>
          </div>
          <button className="btn-icon-danger glass" onClick={() => { setIsLoggedIn(false); setActiveTab('marketplace'); }}>
             <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  </nav>
)

const LoginModal = ({ loginEmail, setLoginEmail, handleLogin, setShowLogin }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
    <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} className="login-card glass-premium">
      <div className="login-header">
        <div className="login-icon-box">
          <Lock size={32} />
        </div>
        <h2>统一登录中心</h2>
        <p>连接全球卓越的自由职业者资源</p>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>电子邮箱 (GMAIL)</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input 
              required
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="请输入您的邮箱地址..." 
            />
          </div>
          {loginEmail === DEVELOPER_EMAIL && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="dev-auth-flag">
               <ShieldAlert size={14} /> 系统管理员权鉴已激活
            </motion.div>
          )}
        </div>
        <div className="input-group">
          <label>安全密码</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input type="password" placeholder="••••••••" required />
          </div>
        </div>
        <button type="submit" className="btn-login-submit">进入平台</button>
        <div className="login-divider"><span>OR</span></div>
        <button type="button" className="btn-oauth-google glass">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: '18px' }} />
           使用 Google 账号继续
        </button>
        <button type="button" onClick={() => setShowLogin(false)} className="btn-cancel">暂时不需要登录</button>
      </form>
    </motion.div>
  </motion.div>
)

const InvoiceModal = ({ gig, isStripe, currentUser, setShowInvoice }) => {
  if (!gig) return null
  const subtotal = gig.price
  const platformFee = subtotal * PLATFORM_FEE_RATE
  const sst = subtotal * MALAYSIA_SST_RATE
  const netAmount = subtotal - platformFee - sst
  const txId = Math.random().toString(36).substring(7).toUpperCase()

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.95)' }}>
      <motion.div 
        layoutId="invoice"
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }} 
        animate={{ scale: 1, opacity: 1, rotateX: 0 }} 
        className="invoice-container shadow-2xl"
        style={{ 
          background: isStripe ? '#ffffff' : 'var(--bg-card)', 
          color: isStripe ? '#1a1f36' : '#fff',
          borderRadius: '32px'
        }}
      >
        <div className="invoice-header-strip" style={{ background: isStripe ? '#635bff' : 'var(--gradient-primary)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={30} />
                    <h1 style={{ fontWeight: 900, letterSpacing: '-1px' }}>GLOBAL TALENT</h1>
                 </div>
                 <p style={{ opacity: 0.8 }}>马代缴税额 e-Invoice 合规系统</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>SERIAL NUMBER</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>GT-{txId}</div>
              </div>
           </div>
        </div>

        <div className="invoice-body">
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '40px' }}>
              <div>
                 <div className="info-label">发行方 (Issuer)</div>
                 <div className="info-value">Global Talent (全球之星) SDN BHD</div>
                 <div className="info-sub">Kuala Lumpur, Malaysia</div>
                 <div className="info-sub" style={{ color: 'var(--primary)', fontWeight: 700 }}>SST ID: W10-1808-320000</div>
              </div>
              <div>
                 <div className="info-label">采纳方 (Billed To)</div>
                 <div className="info-value">{currentUser?.name || 'Guest'}</div>
                 <div className="info-sub">{currentUser?.email}</div>
              </div>
           </div>

           <div className="invoice-table-wrapper">
              <table className="invoice-table">
                 <thead>
                    <tr>
                       <th>服务描述 (Description)</th>
                       <th className="text-right">金额 (Amount)</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{gig.title}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Category: {gig.category} | Seller: {gig.seller || 'SECURED'}</div>
                       </td>
                       <td className="text-right" style={{ fontSize: '1.1rem', fontWeight: 700 }}>RM {subtotal.toFixed(2)}</td>
                    </tr>
                 </tbody>
              </table>
           </div>

           <div className="invoice-summary-section">
              <div className="summary-row"><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></div>
              <div className="summary-row deduction"><span>Platform Fee (7%)</span><span>-RM {platformFee.toFixed(2)}</span></div>
              <div className="summary-row deduction"><span>Malaysia SST (8%)</span><span>-RM {sst.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Payout Amount</span><span style={{ color: isStripe ? '#635bff' : 'var(--primary)' }}>RM {netAmount.toFixed(2)}</span></div>
           </div>

           <div className="invoice-footer">
              <div style={{ flex: 1 }}>
                 <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>由自由职业者 团团熊猫 (TuanTuan Panda) 倾情打造。LHDN 合规系统。</p>
                 <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                    <button className="btn-primary" onClick={() => window.print()}><Printer size={18} /> 打印</button>
                    <button className="btn-secondary" onClick={() => setShowInvoice(null)}>关闭</button>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

const MarketplaceView = ({ isLoggedIn, userRole, setUserRole, setShowPostGig, setShowLogin, userGigs, onBuyGig }) => {
  const defaultGigs = [
    { title: '企业级 React + Node.js 高性能系统定制', seller: 'Tech_Arch', rating: 5.0, reviews: 156, price: 4999, category: '编程开发', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
    { title: '【灵月S1】专业选手级百星代打 全程直播', seller: 'GodPlay', rating: 4.9, reviews: 842, price: 350, category: '竞技代打', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e' },
    { title: '顶级 UI/UX 体验设计：让您的产品像苹果一样极致', seller: 'DesignPro', rating: 5.0, reviews: 42, price: 2800, category: '创意设计', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c' },
  ]
  const allGigs = [...defaultGigs, ...userGigs]

  return (
    <div className="shimmer-view">
      <section className="hero-premium">
         <div className="hero-content">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
               <span className="hero-badge">MADE FOR CREATORS</span>
               <h1 className="hero-text-gradient">全球顶尖技术<br /><span style={{ color: 'var(--text-light)' }}>一站式交易中心</span></h1>
               <p className="hero-desc">由创作者 <strong>团团熊猫</strong> 打造。仅 7% 平台提成，助力每一份才华变现。</p>
               <div className="hero-actions">
                  {!isLoggedIn ? <button className="btn-glow-primary large" onClick={() => setShowLogin(true)}>立即开始</button> : (userRole === 'seller' ? <button className="btn-glow-primary large" onClick={() => setShowPostGig(true)}>发布服务</button> : <button className="btn-glow-primary large" onClick={() => setUserRole('seller')}>成为卖家</button>)}
               </div>
            </motion.div>
         </div>
      </section>

      <section className="grid-section" style={{ padding: '0 5% 100px' }}>
         <h2 className="title-glow" style={{ marginBottom: '40px' }}>正在为您热推的 Gig</h2>
         <div className="grid-container-premium">
            {allGigs.map((gig, i) => <GigCard key={i} gig={gig} onBuy={onBuyGig} />)}
         </div>

         {/* Platform Guide Section - Mirroring README */}
         <div className="glass-premium" style={{ marginTop: '100px', padding: '60px', borderRadius: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
               <div>
                  <h2 className="title-glow" style={{ fontSize: '2.5rem', marginBottom: '25px' }}>🌟 开启您的全球才华之旅</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                     <strong>Global Talent (全球之星)</strong> 不仅仅是一个交易平台。它是自由职业者的避风港。
                     由 <strong>团团熊猫 (TuanTuan Panda)</strong> 倾力调优，集成了极低提成与 LHDN 合规电子发票系统。
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                     <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ color: 'var(--primary)' }}>💼 7% 低提成</h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>让收益最大化回归创作者。</p>
                     </div>
                     <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ color: 'var(--secondary)' }}>🧾 e-Invoice</h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>自动生成的马政府合规发票。</p>
                     </div>
                  </div>
               </div>
               <div className="glass shadow-glow" style={{ background: 'var(--gradient-talent)', padding: '40px', borderRadius: '30px', color: 'white' }}>
                  <h3>创作者寄语</h3>
                  <p style={{ fontStyle: 'italic', margin: '20px 0' }}>"我们不仅交易代码，更在交易信任。每一行代码都是为了让自由职业者的生活更体面。"</p>
                  <div style={{ fontWeight: 900 }}>— 团团熊猫 (Founder)</div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

// --- App Main ---

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
  const [userGigs, setUserGigs] = useState([])

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginEmail === DEVELOPER_EMAIL) {
      setUserRole('developer')
      setCurrentUser({ name: '团团熊猫', email: DEVELOPER_EMAIL })
    } else {
      setUserRole('buyer')
      setCurrentUser({ name: 'GT_User_' + Math.floor(Math.random()*1000), email: loginEmail })
    }
    setIsLoggedIn(true)
    setShowLogin(false)
    setActiveTab(loginEmail === DEVELOPER_EMAIL ? 'developer' : 'marketplace')
  }

  return (
    <div className="app-main-wrapper">
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} userRole={userRole} setActiveTab={setActiveTab} activeTab={activeTab} setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn}/>
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' && <MarketplaceView isLoggedIn={isLoggedIn} userRole={userRole} setUserRole={setUserRole} setShowPostGig={setShowPostGig} setShowLogin={setShowLogin} userGigs={userGigs} onBuyGig={(g) => setShowPayment(g)}/>}
          {/* Add other views via mapping or state... */}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {showLogin && <LoginModal loginEmail={loginEmail} setLoginEmail={setLoginEmail} handleLogin={handleLogin} setShowLogin={setShowLogin}/>}
        {showInvoice && <InvoiceModal gig={showInvoice} isStripe={paymentMethod === 'stripe'} currentUser={currentUser} setShowInvoice={setShowInvoice}/>}
      </AnimatePresence>
      <footer className="footer-premium" style={{ textAlign: 'center', padding: '60px' }}>
         <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>© 2026 GLOBAL TALENT (全球之星). 由 团团熊猫 倾情打造。</p>
      </footer>
    </div>
  )
}

export default App
