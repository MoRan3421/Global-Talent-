import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { 
  Search, ShoppingCart, User, Gamepad2, TrendingUp, ShieldCheck, Heart, Star, 
  MessageSquare, Filter, Zap, Code, Palette, PenTool, Globe, ChevronRight,
  Download, Apple, Play, Wallet, CreditCard, LayoutDashboard, Settings, LogOut,
  Bell, FileText, PieChart, Percent, Mail, Lock, ShieldAlert, CheckCircle, Printer, Send,
  Briefcase, Activity, Target, Award, Rocket, Box, Database, Clock, RefreshCw
} from 'lucide-react'

// --- Constants & Config ---
const PLATFORM_FEE_RATE = 0.07 
const MALAYSIA_SST_RATE = 0.08 
const DEVELOPER_EMAIL = "tuantuanxiongmaoyouxizhubo@gmail.com"

// --- Helper Components (Stable, Outside App) ---

const GlassCard = ({ children, className = "", ...props }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.01 }}
    className={`glass-premium ${className}`} 
    {...props}
  >
    {children}
  </motion.div>
)

const Badge = ({ children, color = "var(--primary)" }) => (
  <span style={{ 
    background: `${color}15`, 
    color: color, 
    padding: '4px 12px', 
    borderRadius: '20px', 
    fontSize: '0.7rem', 
    fontWeight: 800, 
    border: `1px solid ${color}33`,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>
    {children}
  </span>
)

// --- Shared Views ---

const Navbar = ({ isLoggedIn, currentUser, userRole, setActiveTab, activeTab, setShowLogin, setIsLoggedIn }) => (
  <motion.nav 
    initial={{ y: -100 }} 
    animate={{ y: 0 }}
    className="nav-bar shadow-2xl"
  >
    <div className="logo-section" onClick={() => setActiveTab('marketplace')}>
      <div className="logo-icon shadow-glow">
        <Rocket size={24} color="white" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="logo-text">GLOBAL TALENT</span>
        <span className="logo-subtext">全球之星 · CREATOR CLOUD</span>
      </div>
    </div>

    <div className="nav-menu">
      {[
        { id: 'marketplace', label: '服务广场', icon: <Globe size={18}/> },
        { id: 'download', label: '客户端', icon: <Download size={18}/> }
      ].map(item => (
        <a 
          key={item.id}
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }} 
          className={activeTab === item.id ? 'nav-item active' : 'nav-item'}
        >
          {item.icon} {item.label}
        </a>
      ))}
      {isLoggedIn && userRole === 'developer' && (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('developer'); }} className={activeTab === 'developer' ? 'nav-item dev-portal active' : 'nav-item dev-portal'}>
          <Activity size={18} /> 系统监控
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
          <div className="user-profile-badge glass shadow-sm interactable" onClick={() => setActiveTab('profile')}>
             <div className="profile-info text-right" style={{ marginRight: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', fontWeight: 900 }}>{userRole.toUpperCase()}</div>
             </div>
             <div className="avatar-md shadow-glow">{currentUser.name[0]}</div>
          </div>
          <button className="btn-icon-danger glass" onClick={() => { setIsLoggedIn(false); setActiveTab('marketplace'); }}>
             <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  </motion.nav>
)

const GigCard = ({ gig, onBuy }) => {
  return (
    <motion.div 
      layoutId={`gig-${gig.id || Math.random()}`}
      whileHover={{ y: -12, scale: 1.02 }}
      className="gig-card-v2 glass-premium gradient-border"
    >
      <div className="gig-image-wrapper">
         <img src={gig.image} alt={gig.title} />
         <div className="gig-category-overlay">
           <Badge color="var(--secondary)">{gig.category}</Badge>
         </div>
         <div className="gig-heart-btn glass">
            <Heart size={18} />
         </div>
      </div>
      <div className="gig-content-v2">
        <div className="seller-row">
           <div className="avatar-sm" style={{ background: 'var(--gradient-talent)' }}>{gig.seller[0]}</div>
           <span className="seller-name">{gig.seller}</span>
           <div style={{ flex: 1 }}></div>
           <div className="rating-pill">
              <Star size={12} fill="currentColor" /> {gig.rating}
           </div>
        </div>
        <h3 className="gig-title-v2">{gig.title}</h3>
        <p className="gig-meta-v2">7% 提成已计算 | LHDN 合规电子发票</p>
        <div className="gig-footer-v2">
           <div className="price-stack">
              <span className="price-label">Starting At</span>
              <span className="price-value">RM {gig.price.toFixed(2)}</span>
           </div>
           <button className="btn-action-round" onClick={() => onBuy(gig)}>
              <ShoppingCart size={20} />
           </button>
        </div>
      </div>
    </motion.div>
  )
}

// --- Specific Views ---

const MarketplaceView = ({ isLoggedIn, userRole, setUserRole, setShowPostGig, setShowLogin, userGigs, onBuyGig }) => {
  const defaultGigs = [
    { title: '企业级 React + Node.js 高性能架构定制', seller: 'ArchMaster', rating: 5.0, reviews: 156, price: 4999, category: '编程开发', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    { title: '【灵月S1】专业选手级百星成就代打 直播保障', seller: 'GodHand', rating: 4.9, reviews: 842, price: 350, category: '竞技代打', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e' },
    { title: '极简 3A 级 UI/UX 设计：重塑您的品牌灵魂', seller: 'DesignPro', rating: 5.0, reviews: 42, price: 2800, category: '创意设计', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c' },
    { title: '智能合约安全审计：防范一切漏洞', seller: 'Web3Safe', rating: 5.0, reviews: 12, price: 6500, category: '区块链', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0' },
  ]
  const allGigs = [...defaultGigs, ...userGigs]

  return (
    <div className="page-view animate-in">
      {/* Hero Section */}
      <section className="hero-v3">
         <div className="hero-v3-inner">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
               <Badge color="var(--primary)">2026 OFFICIAL PLATFORM</Badge>
               <h1 className="hero-v3-title">全球顶尖技术<br /><span>一站式交易中心</span></h1>
               <p className="hero-v3-desc">
                  汇聚全球自由职业精英。由创作者 **团团熊猫 (TuanTuan Panda)** 领衔打造。
                  提成仅 <strong>7%</strong>，支持马来西亚 LHDN 合规电子发票支付。
               </p>
               <div className="hero-v3-actions">
                  <button className="btn-glow-primary large" onClick={() => (isLoggedIn ? (userRole === 'seller' ? setShowPostGig(true) : setUserRole('seller')) : setShowLogin(true))}>
                    {isLoggedIn ? (userRole === 'seller' ? '+ 发布服务' : '成为卖家') : '开启您的旅程'}
                  </button>
                  <button className="btn-glass large"><Search size={20} /> 浏览全书库</button>
               </div>
            </motion.div>
            <div className="hero-v3-visual">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="hero-orbit glass">
                  <div className="orbit-item"><Code size={24} /></div>
                  <div className="orbit-item"><Palette size={24} /></div>
                  <div className="orbit-item"><Gamepad2 size={24} /></div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Grid Section */}
      <section style={{ padding: '0 5% 100px' }}>
         <div className="section-header-v2">
            <h2>探索专业服务</h2>
            <div className="filters glass">
               <span>热门</span>
               <span>最新</span>
               <span>高性价比</span>
            </div>
         </div>
         <div className="grid-container-premium">
            {allGigs.map((gig, i) => <GigCard key={i} gig={gig} onBuy={onBuyGig} />)}
         </div>

         {/* About Platform - Synchronized with README */}
         <div className="platform-guide-v2 glass-premium gradient-border">
            <div className="guide-content-v2">
               <h2>🌟 全球之星的核心愿景</h2>
               <p>
                  如果您在寻找不仅仅是外包，而是真正的“才华合作伙伴”，那么您来对了地方。
                  由 **团团熊猫** 亲自监制，我们确保每一单交易都受到高度加密保护。
               </p>
               <div className="benefit-grid">
                  <div className="benefit-item">
                     <Percent size={32} color="var(--primary)" />
                     <h4>7% 极低提成</h4>
                     <p>拒绝 20% 的行业砍头息。我们让利于创作者。</p>
                  </div>
                  <div className="benefit-item">
                     <FileText size={32} color="var(--secondary)" />
                     <h4>LHDN 合规发票</h4>
                     <p>所有交易自动开具符合马政府要求的 8% SST 电子发票。</p>
                  </div>
                  <div className="benefit-item">
                     <ShieldCheck size={32} color="var(--accent)" />
                     <h4>担保交易</h4>
                     <p>直到您完全满意并确认，资金才会结算给对方。</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

const ProfileView = ({ currentUser, userRole, setUserRole, userGigs, setShowPostGig, setShowInvoice, setPaymentMethod }) => {
  const [stripeReady, setStripeReady] = useState(false)

  return (
    <div className="page-view animate-in" style={{ padding: '140px 5%' }}>
       <div className="profile-layout-v3">
          <aside className="profile-sidebar-v3">
             <GlassCard className="user-info-card-v3">
                <div className="avatar-xl shadow-glow">{currentUser?.name?.[0]}</div>
                <h2 style={{ marginTop: '20px' }}>{currentUser?.name}</h2>
                <Badge color={userRole === 'seller' ? 'var(--secondary)' : 'var(--primary)'}>{userRole.toUpperCase()}</Badge>
                
                <div className="role-switch-v3 glass">
                   <div className={userRole === 'buyer' ? 'pill active' : 'pill'} onClick={() => setUserRole('buyer')}>买家</div>
                   <div className={userRole === 'seller' ? 'pill active' : 'pill'} onClick={() => setUserRole('seller')}>卖家</div>
                </div>

                <div className="sidebar-links">
                   <div><Settings size={18} /> 账户安全</div>
                   <div><Bell size={18} /> 消息中心</div>
                </div>
             </GlassCard>

             <GlassCard className="stripe-card-v3">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                   <CreditCard size={20} color="#635bff" />
                   <h4 style={{ margin: 0 }}>Stripe 支付网关</h4>
                </div>
                {!stripeReady ? (
                   <button className="btn-stripe-v3" onClick={() => setStripeReady(true)}>连接 Stripe 结算账号</button>
                ) : (
                   <div className="status-success-v3"><CheckCircle size={16} /> 已绑定 Stripe 专用收款账户</div>
                )}
             </GlassCard>
          </aside>

          <main className="profile-main-v3">
             <div className="stats-v3-row">
                <GlassCard className="stat-v3-item">
                   <div className="s-label">总成交额 (GMV)</div>
                   <div className="s-value">RM {userRole === 'seller' ? '12,400' : '840'}</div>
                </GlassCard>
                <GlassCard className="stat-v3-item">
                   <div className="s-label">平台贡献值</div>
                   <div className="s-value">842 XP</div>
                </GlassCard>
                <GlassCard className="stat-v3-item">
                   <div className="s-label">待入账收益</div>
                   <div className="s-value" style={{ color: 'var(--secondary)' }}>RM 420</div>
                </GlassCard>
             </div>

             <GlassCard className="history-v3-card">
                <div className="history-header">
                   <h3>最近交易历史</h3>
                   {userRole === 'seller' && <button className="btn-primary-v3" onClick={() => setShowPostGig(true)}>+ 新增服务</button>}
                </div>
                <div className="history-list">
                   {(userRole === 'seller' ? userGigs : [
                      { title: '专业游戏代打', price: 350, seller: 'ProGamer', category: '竞技代打' },
                      { title: 'React 技术支持', price: 150, seller: 'AppDev', category: '编程开发' }
                   ]).map((item, i) => (
                      <div key={i} className="history-row-v3 glass-hover">
                         <div className="h-icon"><FileText size={20} /></div>
                         <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800 }}>{item.title}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Transaction #GT-882-{i}</div>
                         </div>
                         <div className="h-price">RM {item.price.toFixed(2)}</div>
                         <button className="btn-icon glass" onClick={() => { setPaymentMethod('stripe'); setShowInvoice(item); }}>
                            <Printer size={18} />
                         </button>
                      </div>
                   ))}
                </div>
             </GlassCard>
          </main>
       </div>
    </div>
  )
}

const DeveloperPortal = () => (
  <div className="page-view animate-in" style={{ padding: '140px 5%' }}>
     <div className="dev-header-v3">
        <div>
           <h1 className="title-glow">DEVELOPER <span style={{ color: 'var(--secondary)' }}>PORTAL</span></h1>
           <p style={{ color: 'var(--text-muted)' }}>团团熊猫 (TuanTuan Panda) 专属超级管理终端</p>
        </div>
        <div className="sys-status glass">
           <Activity size={20} color={Math.random() > 0.1 ? '#10b981' : '#f59e0b'} />
           <span>SYSTEM: OPTIMAL</span>
        </div>
     </div>

     <div className="dev-grid-v3">
        {[
           { l: '全网总流转量', v: 'RM 1,248,300', i: <TrendingUp/> },
           { l: '平台纯利润', v: 'RM 187,245', i: <Percent/> },
           { l: '活跃端点', v: '8,402', i: <User/> },
           { l: 'e-Invoice 吞吐量', v: '15,022', i: <FileText/> }
        ].map((stat, i) => (
           <GlassCard key={i} className="dev-stat-card">
              <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>{stat.i}</div>
              <div className="v-num">{stat.v}</div>
              <div className="v-label">{stat.l}</div>
           </GlassCard>
        ))}
     </div>

     <GlassCard className="terminal-v3">
        <div className="terminal-top">
           <div className="t-dots"><div className="d red"></div><div className="d yellow"></div><div className="d green"></div></div>
           <span>GLOBAL_TALENT_CORE_LOGS</span>
        </div>
        <div className="terminal-content">
           <div className="log-l"><span className="time">[16:42:01]</span> <span className="tag info">INFO</span> Kernel initialization complete.</div>
           <div className="log-l"><span className="time">[16:45:12]</span> <span className="tag warn">WARN</span> Load balancer skew detected in AP-SEA region.</div>
           <div className="log-l"><span className="time">[16:50:33]</span> <span className="tag succ">SUCCESS</span> Stripe Batch #992822 validated.</div>
           <div className="log-l"><span className="time">[16:55:00]</span> <span className="tag info">DEBUG</span> Copyright "Global Talent" check passed. Creator: TuanTuan Panda.</div>
           <div className="cursor-bash">_</div>
        </div>
     </GlassCard>
  </div>
)

// --- Modals ---

const InvoiceModal = ({ gig, isStripe, currentUser, setShowInvoice }) => {
  if (!gig) return null
  const subtotal = gig.price
  const platformFee = subtotal * PLATFORM_FEE_RATE
  const sst = subtotal * MALAYSIA_SST_RATE
  const netAmount = subtotal - platformFee - sst
  const txId = Math.random().toString(36).substring(7).toUpperCase()

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.96)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="invoice-modal-v3 shadow-2xl">
         <div className="invoice-header-v3" style={{ background: isStripe ? '#635bff' : 'var(--gradient-talent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <Globe size={32} />
                     <h2 style={{ fontWeight: 900 }}>GLOBAL TALENT</h2>
                  </div>
                  <p style={{ opacity: 0.7 }}>Official Malaysia e-Invoice Support</p>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>TRANSACTION ID</div>
                  <div style={{ fontWeight: 800 }}>GT-{txId}</div>
               </div>
            </div>
         </div>
         <div className="invoice-body-v3">
            <div className="bill-grid">
               <div>
                  <h5 className="label-v3">ISSUER</h5>
                  <p className="val-v3">Global Talent (全球之星)</p>
                  <p className="sub-v3">SST ID: W10-1808-320000</p>
               </div>
               <div>
                  <h5 className="label-v3">BILLED TO</h5>
                  <p className="val-v3">{currentUser?.name || 'Guest'}</p>
                  <p className="sub-v3">{currentUser?.email}</p>
               </div>
            </div>
            <table className="invoice-table-v3">
               <thead><tr><th>DESCRIPTION</th><th className="text-right">PRICE (RM)</th></tr></thead>
               <tbody>
                  <tr>
                    <td><strong>{gig.title}</strong><br/><small>Category: {gig.category}</small></td>
                    <td className="text-right">RM {subtotal.toFixed(2)}</td>
                  </tr>
               </tbody>
            </table>
            <div className="invoice-math-v3">
               <div><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></div>
               <div className="deduct"><span>平台服务费 (7%)</span><span>-RM {platformFee.toFixed(2)}</span></div>
               <div className="deduct"><span>马代缴税额 (8%)</span><span>-RM {sst.toFixed(2)}</span></div>
               <div className="final"><span>PAID TOTAL</span><span>RM {netAmount.toFixed(2)}</span></div>
            </div>
            <div className="invoice-footer-v3">
               <button className="btn-primary-v3" onClick={() => window.print()}><Printer size={18}/> 打印发票</button>
               <button className="btn-secondary-v3" onClick={() => setShowInvoice(null)}>关闭</button>
            </div>
         </div>
      </motion.div>
    </div>
  )
}

const CheckoutModal = ({ gig, paymentMethod, setPaymentMethod, onConfirm, onClose }) => (
  <div className="modal-overlay">
     <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="checkout-card-v3 glass-premium">
        <h3>订单确认中心</h3>
        <p style={{ color: 'var(--text-muted)' }}>正在结算 "{gig.title}"</p>
        <div className="method-list-v3">
           {[
              { id: 'stripe', name: 'Stripe / Card', icon: <CreditCard/> },
              { id: 'tng', name: 'TNG eWallet', icon: <Wallet/> },
              { id: 'bank', name: 'Bank Transfer', icon: <Globe/> }
           ].map(m => (
              <div key={m.id} className={paymentMethod === m.id ? 'method-v3 active' : 'method-v3'} onClick={() => setPaymentMethod(m.id)}>
                 {m.icon} <span>{m.name}</span>
                 {paymentMethod === m.id && <CheckCircle size={14} className="check-v3"/>}
              </div>
           ))}
        </div>
        <div className="price-v3-confirm">RM {gig.price.toFixed(2)}</div>
        <button className="btn-primary-v3" style={{ width: '100%', padding: '15px' }} onClick={onConfirm}>确认支付</button>
        <button className="btn-cancel" style={{ width: '100%', marginTop: '10px' }} onClick={onClose}>取消</button>
     </motion.div>
  </div>
)

const LoginModal = ({ loginEmail, setLoginEmail, handleLogin, setShowLogin }) => (
  <div className="modal-overlay">
     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="login-card-v3 glass-premium">
        <div className="login-icon-box shadow-glow"><Lock size={30} /></div>
        <h2>欢迎来到全球之星</h2>
        <p>由 团团熊猫 (TuanTuan Panda) 领衔打造</p>
        <form onSubmit={handleLogin} className="login-form-v3">
           <div className="input-group-v3">
              <label>电子邮箱 (GMAIL)</label>
              <div className="input-box">
                 <Mail size={18} />
                 <input required type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@gmail.com" />
              </div>
           </div>
           {loginEmail === DEVELOPER_EMAIL && <div className="dev-auth-flag"><ShieldAlert size={14}/> 系统管理员识辨成功</div>}
           <div className="input-group-v3">
              <label>极客验证码 / 密码</label>
              <div className="input-box"><Lock size={18}/><input type="password" placeholder="••••••••" required /></div>
           </div>
           <button type="submit" className="btn-login-v3 shadow-glow">进入平台</button>
           <button type="button" onClick={() => setShowLogin(false)} className="btn-cancel">以后再说</button>
        </form>
     </motion.div>
  </div>
)

// --- Root Component ---

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
    setIsLoggedIn(true); setShowLogin(false); setActiveTab(loginEmail === DEVELOPER_EMAIL ? 'developer' : 'marketplace')
  }

  return (
    <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} userRole={userRole} setActiveTab={setActiveTab} activeTab={activeTab} setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn}/>
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' && <MarketplaceView key="m" isLoggedIn={isLoggedIn} userRole={userRole} setUserRole={setUserRole} setShowPostGig={setShowPostGig} setShowLogin={setShowLogin} userGigs={userGigs} onBuyGig={(g) => setShowPayment(g)}/>}
          {activeTab === 'profile' && <ProfileView key="p" currentUser={currentUser} userRole={userRole} setUserRole={setUserRole} userGigs={userGigs} setShowPostGig={() => setShowPostGig(true)} setShowInvoice={setShowInvoice} setPaymentMethod={setPaymentMethod}/>}
          {activeTab === 'developer' && <DeveloperPortal key="d" />}
          {activeTab === 'download' && (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="download-view">
               <Rocket size={60} color="var(--primary)" style={{ marginBottom: '20px' }}/>
               <h1 className="title-glow">自由之翼，触手可及</h1>
               <p>Global Talent 客户端已完美适配各个平台。由 团团熊猫 亲自校准。</p>
               <div className="app-buttons">
                  <div className="glass-btn"><Apple size={24}/> App Store</div>
                  <div className="glass-btn"><Play size={24}/> Google Play</div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showLogin && <LoginModal loginEmail={loginEmail} setLoginEmail={setLoginEmail} handleLogin={handleLogin} setShowLogin={setShowLogin}/>}
        {showInvoice && <InvoiceModal gig={showInvoice} isStripe={paymentMethod === 'stripe'} currentUser={currentUser} setShowInvoice={setShowInvoice}/>}
        {showPayment && <CheckoutModal gig={showPayment} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onConfirm={() => { setShowPayment(null); setShowInvoice(showPayment); }} onClose={() => setShowPayment(null)}/>}
      </AnimatePresence>

      <footer className="footer-v3">
         <div className="footer-content">
            <div className="brand">GLOBAL TALENT (全球之星)</div>
            <p>Copyright © 2026. 所有版权归全球之星所有。创作者：团团熊猫 (TuanTuan Panda)。</p>
         </div>
      </footer>
    </div>
  )
}

export default App
