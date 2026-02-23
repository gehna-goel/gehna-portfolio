import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RESUME_URL = 'https://drive.google.com/file/d/1fa5Pul8kLadJOk8GSeNhKPlfIUuqYEvU/view'

const TABS = [
  { id: 'projects', label: 'Photobook: Projects' },
  { id: 'cd', label: 'CD: Play' },
  { id: 'about', label: 'Poster: About Me' },
  { id: 'photocard', label: 'Photocard' },
  { id: 'resume', label: 'Resume', onClick: () => window.open(RESUME_URL, '_blank') },
]

const STICKERS = [
  { emoji: '📚', label: 'books' },
  { emoji: '🎭', label: 'kdrama' },
  { emoji: '🐱', label: 'cat' },
  { emoji: '🦊', label: 'fox' },
  { emoji: '🍓', label: 'strawberry' },
  { emoji: '🍵', label: 'tea' },
  { emoji: '🦕', label: 'dinosaur' },
  { emoji: '☕', label: 'coffee' },
  { emoji: '🧋', label: 'boba' },
  { emoji: '💜', label: 'heart' },
  { emoji: '🌸', label: 'flower' },
  { emoji: '🍵', label: 'matcha' },
  { emoji: '🍜', label: 'ramen' },
  { emoji: '🎵', label: 'kpop' },
  { emoji: '🎧', label: 'music' },
  { emoji: '🌙', label: 'moon' },
  { emoji: '✨', label: 'sparkle' },
  { emoji: '🌿', label: 'leaf' },
  { emoji: '🍡', label: 'dango' },
  { emoji: '🐾', label: 'paws' },
]

const TRACKS = [
  { num: '01', title: 'S-Class', ytId: 'AjPiGdRTQyQ' },
  { num: '02', title: 'MIROH', ytId: 'f7LNXQ01W_8' },
  { num: '03', title: 'Hall of Fame', ytId: 'VrBf2vyCWaA' },
  { num: '04', title: 'Collision', ytId: 'ZbhGrLYCCf4' },
  { num: '05', title: 'Item', ytId: 'R2-LQo7AFNE' },
  { num: '06', title: 'Youtiful', ytId: 'wBJFOBxuLZQ' },
  { num: '07', title: "神메뉴 (God's Menu)", ytId: 'PlMqvxGPRrc' },
  { num: '08', title: 'Chk Chk Boom', ytId: 'P1eS62Gs2Xk' },
  { num: '09', title: 'CASE 143', ytId: 'yb4UGaFJPBM' },
  { num: '10', title: 'TOP', ytId: 'C6GHSMfVXAk' },
  { num: '11', title: 'Social Path (feat. LiSA)', ytId: '_wU9YEFiGpA' },
]

export default function App() {
  const [view, setView] = useState('cover')
  const [activeTab, setActiveTab] = useState('projects')
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [cdPlaying, setCdPlaying] = useState(false)
  const [ytPlayer, setYtPlayer] = useState(null)
  const [photocardVisible, setPhotocardVisible] = useState(false)
  const [stickerSheetOpen, setStickerSheetOpen] = useState(false)
  const [placedStickers, setPlacedStickers] = useState([])
  const ytContainerRef = useRef(null)

  useEffect(() => {
    if (window.YT) return
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) firstScript.parentNode.insertBefore(tag, firstScript)
  }, [])

  const playTrack = (index) => {
    const track = TRACKS[index]
    setSelectedTrack(index)
    setCdPlaying(true)
    if (ytContainerRef.current) {
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(track.ytId)
      } else {
        const tryCreate = () => {
          if (window.YT && window.YT.Player) {
            const p = new window.YT.Player(ytContainerRef.current, {
              height: '0',
              width: '0',
              videoId: track.ytId,
              playerVars: { autoplay: 1 },
              events: {
                onReady: (e) => { e.target.playVideo(); setYtPlayer(e.target) },
                onStateChange: (e) => { if (e.data === 0) setCdPlaying(false) },
              },
            })
            setYtPlayer(p)
          } else {
            setTimeout(tryCreate, 500)
          }
        }
        tryCreate()
      }
    }
  }

  const stopTrack = () => {
    if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo()
    setCdPlaying(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <AnimatePresence mode="wait">
        {view === 'cover' && (
          <LandingCover key="cover" onOpen={() => setView('notebook')} />
        )}
        {view === 'notebook' && (
          <NotebookOpen
            key="notebook"
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            cdPlaying={cdPlaying}
            setCdPlaying={setCdPlaying}
            playTrack={playTrack}
            stopTrack={stopTrack}
            ytContainerRef={ytContainerRef}
            photocardVisible={photocardVisible}
            setPhotocardVisible={setPhotocardVisible}
            stickerSheetOpen={stickerSheetOpen}
            setStickerSheetOpen={setStickerSheetOpen}
            placedStickers={placedStickers}
            setPlacedStickers={setPlacedStickers}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── stable star list ──────────────────────────────────────────────────────────
function useLandingStars(n = 200) {
  return useMemo(() => Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: i < 120 ? Math.random() * 0.5 + 1 : i < 170 ? Math.random() * 1 + 1.5 : Math.random() * 1.5 + 2.5,
    dur: 2 + Math.random() * 6,
    delay: Math.random() * 8,
    color: '#ffffff',
  })), [n])
}

// ── LandingCover ──────────────────────────────────────────────────────────────
function LandingCover({ onOpen }) {
  const [hovered, setHovered] = useState(false)

  const stars = useLandingStars(200)

  const starbursts = [
    { x: 8, y: 12, size: 18 }, { x: 85, y: 8, size: 14 },
    { x: 5, y: 70, size: 12 }, { x: 90, y: 65, size: 16 },
    { x: 48, y: 5, size: 11 }, { x: 20, y: 88, size: 9 },
    { x: 75, y: 85, size: 13 }, { x: 92, y: 40, size: 10 },
  ]

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        perspective: '1200px',
        background: '#000000',
      }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full star-twinkle"
          style={{
            width: s.size + 'px', height: s.size + 'px',
            left: s.x + '%', top: s.y + '%',
            background: s.color,
            boxShadow: s.size > 2.5 ? `0 0 ${s.size * 2}px ${s.color}` : 'none',
            '--dur': s.dur + 's',
            '--delay': s.delay + 's',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Starbursts */}
      {starbursts.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: s.x + '%', top: s.y + '%',
            fontSize: s.size + 'px', color: '#fff', opacity: 0.35,
            animation: `starburst-pulse ${3.5 + i * 0.6}s ease-in-out infinite`,
            animationDelay: i * 0.4 + 's',
          }}
        >✦</div>
      ))}

      {/* Album — 340×460, centered, -3deg tilt, space-float; click opens notebook */}
      <motion.div
        style={{ transform: 'rotate(-3deg)' }}
      >
        <motion.div
          className="relative space-float"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(255,255,255,0.12)) drop-shadow(0 20px 80px rgba(255,255,255,0.08))',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
        <div
          style={{
            width: '340px', height: '460px',
            background: '#000',
            border: '3px solid #fff',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={onOpen}
        >
          {/* Simple inner border (no grid background) */}
          <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(255,255,255,0.5)', pointerEvents: 'none', borderRadius: 2 }} />

          {/* 5 stars with radiating lines */}
          <div style={{ position: 'absolute', top: '22%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              {[28, 36, 44, 36, 28].map((size, i) => (
                <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[...Array(8)].map((_, j) => (
                    <div key={j} style={{
                      position: 'absolute', width: 1, background: 'rgba(255,255,255,0.3)',
                      height: size * 0.8,
                      transformOrigin: 'center bottom',
                      transform: `rotate(${j * 45}deg) translateY(-${size * 0.5}px)`,
                    }} />
                  ))}
                  <span style={{
                    fontSize: size, color: '#e8e8e8', lineHeight: 1, position: 'relative', zIndex: 1,
                    filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))',
                  }}>★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gehna Goel — large centered (Playfair Display italic 38px) */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, textAlign: 'center', transform: 'translateY(-50%)' }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 38, color: '#fff', fontStyle: 'italic', lineHeight: 1.2,
              textShadow: '0 0 20px rgba(255,255,255,0.4)',
              margin: 0,
            }}>Gehna Goel</h1>
          </div>

          {/* Decorative clouds + burst stars (✸ ☁) at bottom */}
          <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 4, marginBottom: 6, padding: '0 16px' }}>
              <span style={{ color: '#fff', fontSize: 16, opacity: 0.7 }}>✸</span>
              <span style={{ color: '#fff', fontSize: 12, opacity: 0.5 }}>☁</span>
              <span style={{ color: '#fff', fontSize: 20, opacity: 0.9, filter: 'drop-shadow(0 0 8px #fff)' }}>✸</span>
              <span style={{ color: '#fff', fontSize: 14, opacity: 0.6 }}>☁</span>
              <span style={{ color: '#fff', fontSize: 14, opacity: 0.5 }}>☁</span>
              <span style={{ color: '#fff', fontSize: 18, opacity: 0.8, filter: 'drop-shadow(0 0 6px #fff)' }}>✸</span>
              <span style={{ color: '#fff', fontSize: 12, opacity: 0.5 }}>☁</span>
              <span style={{ color: '#fff', fontSize: 14, opacity: 0.7 }}>✸</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
              {['☁','☁','☁','☁','☁','☁'].map((c, i) => (
                <span key={i} style={{ color: '#fff', fontSize: 14, opacity: 0.5 + i * 0.05 }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Hover overlay — click to unbox */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p style={{ fontFamily: 'Space Mono, monospace', color: '#fff', fontSize: '11px', letterSpacing: '0.2em', margin: 0 }}>click to</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#fff', fontSize: '26px', margin: 0 }}>unbox</p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#fff', fontSize: '10px', filter: 'drop-shadow(0 0 5px #fff)' }}>★</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </motion.div>
      </motion.div>

      {/* Name below album */}
      <motion.p
        style={{
          fontFamily: 'Space Mono, monospace',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '10px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginTop: '28px',
          userSelect: 'none',
        }}
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        Gehna Goel
      </motion.p>
    </motion.div>
  )
}

// ── NotebookOpen ──────────────────────────────────────────────────────────────
function NotebookOpen({
  setView, activeTab, setActiveTab,
  selectedTrack, setSelectedTrack,
  cdPlaying, setCdPlaying, playTrack, stopTrack, ytContainerRef,
  photocardVisible, setPhotocardVisible,
  stickerSheetOpen, setStickerSheetOpen,
  placedStickers, setPlacedStickers,
}) {
  return (
    <motion.div
      className="min-h-screen"
      style={{ background: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div ref={ytContainerRef} id="yt-player" style={{ display: 'none' }} />

      <nav className="sticky top-0 z-40 border-b" style={{ background: '#000', borderColor: '#222' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={() => setView('cover')}
            className="font-mono text-xs transition-colors"
            style={{ color: '#666' }}
            onMouseEnter={(e) => { e.target.style.color = '#fff' }}
            onMouseLeave={(e) => { e.target.style.color = '#666' }}
          >
            ← close
          </button>
          <div className="flex gap-1 flex-wrap justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.onClick) tab.onClick()
                  else setActiveTab(tab.id)
                }}
                className="font-mono text-[10px] tracking-wider px-3 py-2 rounded transition-all"
                style={{
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  color: activeTab === tab.id ? '#000' : '#666',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                }}
                onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = '#666' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStickerSheetOpen(!stickerSheetOpen)}
            className="font-mono text-[10px] px-3 py-2 rounded transition-all"
            style={{ border: '1px solid #333', color: stickerSheetOpen ? '#fff' : '#666' }}
          >
            ✦ stickers
          </button>
        </div>

        <AnimatePresence>
          {stickerSheetOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b"
              style={{ background: '#000', borderColor: '#222' }}
            >
              <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
                <p className="font-mono text-[9px] tracking-widest" style={{ color: '#888' }}>click a sticker to place it anywhere →</p>
                <div className="flex gap-2 flex-wrap">
                  {STICKERS.map((s, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setPlacedStickers((prev) => [
                        ...prev,
                        { ...s, id: Date.now() + i, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, rotation: Math.random() * 30 - 15 },
                      ])}
                      className="text-2xl rounded-lg w-10 h-10 flex items-center justify-center"
                      style={{ background: '#111', border: '1px solid #333' }}
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {s.emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Ring strip */}
      <div className="w-full py-2 flex justify-center gap-8 border-b flex-wrap" style={{ background: '#000', borderColor: '#222' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="ring-hole" />
        ))}
      </div>

      <div className={activeTab === 'projects' ? '' : 'max-w-6xl mx-auto px-6 py-8'} style={activeTab === 'projects' ? { width: '100%', maxWidth: 'none', margin: 0, padding: 0 } : undefined}>
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && <ProjectsPage key="projects" />}
          {activeTab === 'cd' && (
            <CDPage
              key="cd"
              cdPlaying={cdPlaying}
              setCdPlaying={setCdPlaying}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
              playTrack={playTrack}
              stopTrack={stopTrack}
            />
          )}
          {activeTab === 'about' && <AboutMePage key="about" />}
          {activeTab === 'photocard' && <PhotocardPage key="photocard" />}
        </AnimatePresence>
      </div>

      {/* Easter egg button */}
      <div className="fixed bottom-6 left-6 z-30">
        <motion.button
          onClick={() => setPhotocardVisible(!photocardVisible)}
          className="w-6 h-6 rounded-full border"
          style={{ borderColor: '#333', background: '#111', boxShadow: '0 0 20px rgba(255,255,255,0.15)' }}
          whileHover={{ scale: 1.5 }}
          title="?"
          aria-label="Easter egg"
        />
        <AnimatePresence>
          {photocardVisible && <PhotocardModal onClose={() => setPhotocardVisible(false)} />}
        </AnimatePresence>
      </div>

      <PlacedStickers stickers={placedStickers} />

      {placedStickers.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setPlacedStickers([])}
          className="fixed bottom-6 right-6 z-50 font-mono text-xs px-4 py-2 rounded-full"
          style={{ background: '#000', border: '1px solid #fff', color: '#fff', boxShadow: '0 0 20px rgba(255,255,255,0.15)' }}
          whileHover={{ boxShadow: '0 0 30px rgba(255,255,255,0.3)', scale: 1.05 }}
        >
          ✦ clean
        </motion.button>
      )}
    </motion.div>
  )
}

// ── Projects data ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: 'STAY Connected',
    type: 'UX Design · Mobile App',
    year: '2025',
    tags: ['User Research', 'UX Strategy', 'Prototyping', 'Vibe Coding'],
    role: 'Lead UX Designer',
    tools: 'Figma · Lovable · FigJam · Miro · GitHub',
    description: 'Designed a unified fan platform that reduced content fragmentation for Stray Kids fans — consolidating live recaps, event discovery, and community into one seamless mobile experience. Validated through user research with 12+ participants across 3 iterative testing rounds.',
    thumbnail: 'https://framerusercontent.com/images/74fHcNW8doUIGEW8WlZbmUGtWJc.png?width=1200',
    link: 'https://www.gehnagoel.com/stay-connected',
  },
  {
    id: 2,
    title: 'Takeout',
    type: 'UX Design · Mobile App',
    year: '2024',
    tags: ['User Research', 'UI/UX Design', 'Prototyping', 'Usability Testing'],
    role: 'Lead UX Designer',
    tools: 'Figma · Procreate · Adobe Photoshop · Google Suite',
    description: 'Designed a mobile platform connecting restaurants with nearby users to redistribute surplus food — reducing waste while creating a discovery-first experience for budget-conscious diners. Validated through competitive research, user interviews, and two rounds of usability testing.',
    thumbnail: 'https://framerusercontent.com/images/NSu3SfiBzGndpOyIlNdpiGgG5k.png?width=1200',
    link: 'https://www.gehnagoel.com/takeout',
  },
  {
    id: 3,
    title: 'AI-Gen HelpAssist',
    type: 'UX Design · Enterprise Tool',
    year: '2023',
    tags: ['AI/UX', 'Enterprise Design', 'Research', 'Prototyping'],
    role: 'UX Designer at Accenture',
    tools: 'Figma · Microsoft Teams',
    description: 'Designed an AI-powered support tool that helped service desk agents resolve multilingual tickets faster — automating translation, response generation, and summarization to reduce agent workload and improve response accuracy.',
    thumbnail: 'https://framerusercontent.com/images/ZhB1BCMtYLPSxGXS0mboypzLM.png?width=1200',
    link: 'https://www.gehnagoel.com/ai-gen-helpassist',
  },
]

const PLAY_PROJECTS = [
  { title: 'Silent Patient', category: 'Book Cover Redesign', year: '2022', image: 'https://framerusercontent.com/images/EosR2sZ5YRW04QxtfWhOH7QL4sY.jpg?width=600', link: 'https://www.behance.net/gallery/182826737/The-Silent-Patient-book-cover-redesign' },
  { title: 'Website + Stickers', category: 'Sticker Design · Branding', year: '2023', image: 'https://framerusercontent.com/images/GX1blq2HjMBXIb6PnIdT0QZURgo.png?width=600', link: 'https://www.hackhayward.org/' },
  { title: "Za'atar Sands Cafe", category: 'Branding', year: '2023', image: 'https://framerusercontent.com/images/8ThUCPlyb9HZkNlh7SKI5CNgVo0.jpg?width=600', link: 'https://www.behance.net/gallery/223264293/Zaatar-Sands-Cafe-Branding' },
  { title: 'Dreaming Out Loud', category: 'Mixed Media Art', year: '2023', image: 'https://framerusercontent.com/images/LrfTnvGx9LlfemHVzv8fgaMY.jpg?width=600', link: 'https://www.behance.net/gallery/179905437/Dreaming-out-loud' },
  { title: 'Vending Machine', category: '3D Modeling', year: '2023', image: 'https://framerusercontent.com/images/BFg1D6UJgEty1YW34BTD6CT82fo.png?width=600', link: 'https://vedika0103.github.io/vending-machine/' },
  { title: 'Delicious ABCs', category: 'Letter Illustrations', year: '2023', image: 'https://framerusercontent.com/images/xKu2dJjCS3OECF6LYoXtdDPzeg.jpg?width=600', link: 'https://www.behance.net/gallery/223264901/Delicious-ABCs' },
]

// ── ProjectsPage — single project per spread (flipbook) ────────────────────────
function ProjectsPage() {
  const [currentProject, setCurrentProject] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState('next')

  const goTo = (dir) => {
    const next = currentProject + dir
    if (next < 0 || next >= projects.length) return
    setFlipDir(dir > 0 ? 'next' : 'prev')
    setFlipping(true)
    setTimeout(() => { setCurrentProject(next); setFlipping(false) }, 400)
  }

  const p = projects[currentProject]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        width: '100%',
        maxWidth: 'none',
        margin: 0,
      }}
    >
      {/* Book spread — flex 1, fills remaining space; flex layout: left 420px, right flex 1 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          border: '1px solid #222',
          overflow: 'hidden',
        }}
      >
        {/* LEFT PAGE — fixed 420px, scrollable */}
        <motion.div
          onClick={() => window.open(p.link, '_blank')}
          animate={{ opacity: flipping ? 0 : 1, x: flipping && flipDir === 'next' ? -20 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 420,
            flexShrink: 0,
            padding: 48,
            background: '#080808',
            borderRight: '1px solid #1a1a1a',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto',
            backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(255,255,255,0.025) 27px, rgba(255,255,255,0.025) 28px)',
          }}
        >
          <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#555', letterSpacing: '0.35em', marginBottom: 8 }}>
            {String(currentProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#fff', marginBottom: 8 }}>{p.title}</h2>
          <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#888', letterSpacing: '0.15em', marginBottom: 24 }}>{p.type} · {p.year}</p>
          <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8, marginBottom: 24 }}>{p.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            <div>
              <p style={{ fontFamily: 'Space Mono', fontSize: 8, color: '#555', letterSpacing: '0.3em', marginBottom: 4 }}>ROLE</p>
              <p style={{ fontSize: 12, color: '#aaa' }}>{p.role}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'Space Mono', fontSize: 8, color: '#555', letterSpacing: '0.3em', marginBottom: 4 }}>TOOLS</p>
              <p style={{ fontSize: 12, color: '#aaa' }}>{p.tools}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontFamily: 'Space Mono', fontSize: 8, border: '1px solid #2a2a2a',
                color: '#888', padding: '3px 10px', borderRadius: 20 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid #444', color: '#ccc', padding: '8px 16px', borderRadius: 4,
            fontFamily: 'Space Mono', fontSize: 11, alignSelf: 'flex-start' }}>
            ↗ view project
          </div>
        </motion.div>

        {/* RIGHT PAGE — flex 1, image contained and centered */}
        <motion.div
          onClick={() => window.open(p.link, '_blank')}
          animate={{
            opacity: flipping ? 0 : 1,
            rotateY: flipping ? (flipDir === 'next' ? -15 : 15) : 0,
          }}
          transition={{ duration: 0.35 }}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={p.thumbnail}
            alt={p.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'grayscale(15%)',
            }}
            onError={e => { e.target.style.background = '#111' }}
          />
        </motion.div>
      </div>

      {/* Prev/next — fixed height at bottom */}
      <div
        style={{
          flexShrink: 0,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderTop: '1px solid #222',
          background: '#000',
        }}
      >
        <button onClick={() => goTo(-1)} disabled={currentProject === 0}
          style={{ fontFamily: 'Space Mono', fontSize: 12, border: '1px solid #333',
            color: currentProject === 0 ? '#2a2a2a' : '#fff', background: 'transparent',
            padding: '8px 20px', borderRadius: 4, cursor: currentProject === 0 ? 'default' : 'pointer' }}>
          ← prev
        </button>
        <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#555' }}>
          {String(currentProject + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}
        </span>
        <button onClick={() => goTo(1)} disabled={currentProject === projects.length - 1}
          style={{ fontFamily: 'Space Mono', fontSize: 12, border: '1px solid #333',
            color: currentProject === projects.length - 1 ? '#2a2a2a' : '#fff', background: 'transparent',
            padding: '8px 20px', borderRadius: 4, cursor: currentProject === projects.length - 1 ? 'default' : 'pointer' }}>
          next →
        </button>
      </div>
    </motion.div>
  )
}

// ── PlayGrid — 3-column rectangular cards (Outside Work) ──────────────────────────
function PlayGrid() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#555', letterSpacing: '0.3em', marginBottom: 4 }}>OUTSIDE WORK</p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#fff' }}>Play</h2>
        <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>passion projects & experiments</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {PLAY_PROJECTS.map((p) => (
          <motion.div key={p.title} className="play-card"
            onClick={() => window.open(p.link, '_blank')}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255,255,255,0.08)' }}
            style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden',
              border: '1px solid #1a1a1a', position: 'relative', height: 280, minHeight: 280 }}
          >
            <img src={p.image} alt={p.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' }}
              onError={e => { e.target.style.background = '#111'; e.target.style.minHeight = '280px'; }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              padding: '32px 12px 12px' }}>
              <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#aaa', marginBottom: 3 }}>{p.category}</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: '#fff' }}>{p.title}</p>
            </div>
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)',
              borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
              className="card-arrow">
              <span style={{ color: '#fff', fontSize: 10 }}>↗</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── CDPage ────────────────────────────────────────────────────────────────────
function CDPage({ cdPlaying, setCdPlaying, selectedTrack, playTrack, stopTrack }) {
  const [audio] = useState(() => new Audio('/sclass.mp3'))

  useEffect(() => {
    return () => { audio.pause() }
  }, [audio])

  const togglePlay = () => {
    if (cdPlaying) {
      audio.pause()
      setCdPlaying(false)
    } else {
      stopTrack()
      audio.play().then(() => {
        setCdPlaying(true)
      }).catch(err => console.log('play failed:', err))
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-12">
        {/* Left — CD + tracklist */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0" style={{ width: '220px' }}>
          <p className="font-mono text-xs tracking-widest" style={{ color: '#888' }}>CD · PLAY</p>

          <div
            className={`w-52 h-52 rounded-full relative cursor-pointer ${cdPlaying ? 'cd-spin' : ''}`}
            onClick={togglePlay}
            style={{
              background: 'conic-gradient(from 0deg, #000 0%, #333 15%, #888 30%, #fff 45%, #ccc 55%, #666 70%, #222 85%, #000 100%)',
              border: '3px solid #fff',
              boxShadow: cdPlaying
                ? '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)'
                : '0 4px 20px rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center" style={{ background: '#000', border: '2px solid #fff' }}>
                <p className="font-mono text-white text-[7px] tracking-widest">GEHNA</p>
                <p className="font-serif text-white text-xs italic">{cdPlaying ? 'stop' : 'play'}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#fff', fontSize: '6px' }}>★</span>)}
                </div>
              </div>
            </div>
          </div>

          <p className="font-mono text-xs" style={{ color: cdPlaying ? '#fff' : '#666' }}>
            {cdPlaying ? `▶ ${TRACKS[selectedTrack].title}` : 'click to play'}
          </p>

          {/* Tracklist */}
          <div className="w-full mt-2">
            <p className="font-mono text-[9px] tracking-widest mb-2" style={{ color: '#555' }}>TRACKLIST</p>
            {TRACKS.map((track, i) => (
              <button
                key={i}
                onClick={() => { audio.pause(); playTrack(i) }}
                className="w-full flex items-center gap-2 py-1 text-left transition-all hover:pl-1"
                style={{ borderBottom: '1px solid #1a1a1a' }}
              >
                <span className="font-mono text-[9px] w-5 flex-shrink-0" style={{ color: selectedTrack === i ? '#fff' : '#444' }}>{track.num}</span>
                <span className="font-mono text-[10px] truncate" style={{ color: selectedTrack === i ? '#fff' : '#666' }}>{track.title}</span>
                {selectedTrack === i && cdPlaying && <span className="ml-auto text-white" style={{ fontSize: '8px' }}>▶</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Play grid */}
        <div className="flex-1">
          <PlayGrid />
        </div>
      </div>
    </motion.div>
  )
}

// ── AboutMePage — content always visible (no scroll/unroll) ────────────────────
function AboutMePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '0 0 32px', borderBottom: '1px solid #1a1a1a', marginBottom: 32 }}>
        <p style={{ fontFamily: 'Space Mono', fontSize: 8, letterSpacing: '0.5em', color: '#555', marginBottom: 10 }}>ABOUT</p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 52, color: '#fff', marginBottom: 6 }}>Gehna Goel</h2>
        <p style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#888', letterSpacing: '0.3em' }}>UX Designer</p>
      </div>

      {/* Photo + bio */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 32, marginBottom: 40 }}>
        <img src="https://framerusercontent.com/images/lk65now13yOkev9HNhOQOjYlo.jpeg?width=600"
          alt="Gehna" style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'top',
            borderRadius: 4, border: '1px solid #2a2a2a', filter: 'grayscale(20%)' }}
          onError={e => { e.target.style.display = 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.8 }}>
            I'm a product designer passionate about research, systems thinking, and creating experiences that genuinely connect with people. I've worked across enterprise tools and consumer-facing products, and I'm currently completing my Master's in Interaction Design at California State University, East Bay with a 4.0 GPA.
          </p>
          <p style={{ fontSize: 14, color: '#999', lineHeight: 1.8, fontStyle: 'italic' }}>
            Outside of design, I document my world through a visual diary of travels, everyday moments, and things that catch my eye. I'm learning Korean, love K-dramas and K-pop, and am almost always either reading or having hot chai.
          </p>
        </div>
      </div>

      {/* Experience + Toolbox */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32,
        paddingTop: 32, borderTop: '1px solid #1a1a1a' }}>
        <div>
          <p style={{ fontFamily: 'Space Mono', fontSize: 8, letterSpacing: '0.35em', color: '#555', marginBottom: 20 }}>EXPERIENCE</p>
          {[
            { role: 'UX & Marketing Intern', place: 'Chartwells Higher Ed', years: 'Aug 2025–Present' },
            { role: 'UX & Communication Design Assistant', place: 'Cal State East Bay', years: 'Jan 2025–Present' },
            { role: 'User Experience Engineering Analyst', place: 'Accenture', years: 'Jan 2023–Jun 2024' },
            { role: 'Graphic Design Intern', place: 'Karnival', years: 'Sept–Dec 2022' },
            { role: 'UI/UX Design Intern', place: 'Coriolis Technologies', years: 'Jan–Jul 2022' },
            { role: 'UI/UX Design Intern', place: 'Roots & Stalks Digital', years: 'Jan–May 2022' },
          ].map((e, i) => (
            <div key={i} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: '2px solid #2a2a2a' }}>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#fff' }}>{e.role}</p>
              <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#aaa', marginTop: 3 }}>{e.place}</p>
              <p style={{ fontFamily: 'Space Mono', fontSize: 8, color: '#555', marginTop: 2 }}>{e.years}</p>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontFamily: 'Space Mono', fontSize: 8, letterSpacing: '0.35em', color: '#555', marginBottom: 20 }}>TOOLBOX</p>
          {[
            { cat: 'Creative', tools: ['Figma', 'Adobe XD', 'Photoshop', 'Framer', 'Blender'] },
            { cat: 'AI Tools', tools: ['Figma Make', 'Lovable', 'Claude'] },
            { cat: 'Other', tools: ['Miro', 'FigJam', 'JIRA', 'P5.js', 'Slack'] },
          ].map(({ cat, tools }) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#aaa', letterSpacing: '0.2em', marginBottom: 8 }}>{cat}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tools.map(t => (
                  <span key={t} style={{ fontFamily: 'Space Mono', fontSize: 9, border: '1px solid #2a2a2a',
                    color: '#ccc', background: '#0a0a0a', padding: '3px 10px', borderRadius: 20 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1a1a1a' }}>
            <p style={{ fontFamily: 'Space Mono', fontSize: 8, letterSpacing: '0.35em', color: '#555', marginBottom: 8 }}>EDUCATION</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#fff' }}>Master's in Interaction Design</p>
            <p style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#888', marginTop: 4 }}>California State University, East Bay · 4.0 GPA</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Photocard data ────────────────────────────────────────────────────────────
// ⚠️  Save 3 photos to your /public folder:
//   photo1.jpg  →  screenshot from https://www.instagram.com/p/DUe6qYDAvij/
//   photo2.jpg  →  screenshot from https://www.instagram.com/p/DP1uacQATQX/
//   photo3.jpg  →  screenshot from https://www.instagram.com/p/DPVcgjNjiI_/
const photocardCards = [
  {
    rarity: 'STANDARD',
    message: 'A classic! You got the standard card ✦',
    frontLabel: 'VER. A',
    frontBg: '#f5f5f5',
    frontBorder: '#222',
    textColor: '#000',
    backImage: '/photo1.jpg',
    backAlt: 'Gehna',
    instagramLink: 'https://www.instagram.com/tinypocketangerine',
  },
  {
    rarity: 'RARE',
    message: 'Ooh, a rare pull! Lucky you 🌙',
    frontLabel: 'VER. B',
    frontBg: '#f0f0f0',
    frontBorder: '#000',
    textColor: '#000',
    backImage: '/photo2.jpg',
    backAlt: 'Gehna',
    instagramLink: 'https://www.instagram.com/tinypocketangerine',
  },
  {
    rarity: '✦ SUPER RARE ✦',
    message: "It's the super rare one — congratulations!! 🎉✨",
    frontLabel: 'VER. C',
    frontBg: '#fff',
    frontBorder: '#111',
    textColor: '#000',
    backImage: '/photo3.jpg',
    backAlt: 'Gehna',
    instagramLink: 'https://www.instagram.com/tinypocketangerine',
  },
]

// ── PhotocardPage ─────────────────────────────────────────────────────────────
function PhotocardPage() {
  const [flipped, setFlipped] = useState([false, false, false])
  const toggle = (i) => setFlipped((prev) => prev.map((f, idx) => idx === i ? !f : f))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
      <div className="text-center mb-10">
        <p className="font-mono text-[9px] tracking-[0.3em] mb-1" style={{ color: '#888' }}>★★★★★</p>
        <h2 className="font-serif text-4xl text-white mb-1">What photocard did you get?</h2>
        <p className="font-mono text-xs" style={{ color: '#666' }}>click to reveal</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {photocardCards.map((card, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div
              className="cursor-pointer"
              style={{ width: '160px', height: '220px', perspective: '1000px' }}
              onClick={() => toggle(i)}
            >
              <motion.div
                style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
                animate={{ rotateY: flipped[i] ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
              >
                {/* Card front — white background, dark ornate border (Ver. C style) */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: card.frontBg,
                  borderRadius: '10px', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}>
                  {/* Outer ornate border — dark maze pattern */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    border: `10px solid ${card.frontBorder}`,
                    borderRadius: '10px',
                    backgroundImage: `
                      repeating-linear-gradient(90deg, ${card.frontBorder} 0, ${card.frontBorder} 2px, transparent 0, transparent 8px),
                      repeating-linear-gradient(180deg, ${card.frontBorder} 0, ${card.frontBorder} 2px, transparent 0, transparent 8px)
                    `,
                    backgroundSize: '8px 8px',
                    backgroundClip: 'padding-box',
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ position: 'absolute', inset: 10, border: `2px solid ${card.frontBorder}`, borderRadius: 4, opacity: 0.3, pointerEvents: 'none' }} />
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '16px 12px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[...Array(5)].map((_, j) => (
                        <span key={j} style={{ color: card.textColor, fontSize: 14, opacity: 0.85 }}>★</span>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{
                        fontFamily: 'Playfair Display, serif', fontSize: 72, lineHeight: 1, fontWeight: 700,
                        color: '#fff',
                        WebkitTextStroke: `2px ${card.frontBorder}`,
                      }}>특</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Space Mono', fontSize: 7, color: card.textColor,
                        letterSpacing: '0.25em', opacity: 0.7 }}>GEHNA GOEL</p>
                      <p style={{ fontFamily: 'Space Mono', fontSize: 6, color: card.textColor,
                        letterSpacing: '0.15em', opacity: 0.4, marginTop: 2 }}>{card.frontLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Card back */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '12px', overflow: 'hidden',
                  border: `2px solid ${card.frontBorder}`,
                }}>
                  <img
                    src={card.backImage}
                    alt={card.backAlt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    onError={(e) => {
                      // Fallback to Framer images if local photos aren't saved yet
                      const fallbacks = [
                        'https://framerusercontent.com/images/9AQkh9gl6ya4epcQ3uYh1dRrNPA.jpg?width=400',
                        'https://framerusercontent.com/images/vRGzDCoAa3FL7sqrLaJWbF27cI.jpg?width=400',
                        'https://framerusercontent.com/images/8bxZQIWZK7qRfEYIt0aipIWLGg.jpg?width=400',
                      ]
                      if (e.target.src !== fallbacks[i]) e.target.src = fallbacks[i]
                      else { e.target.parentElement.style.background = '#1a1a1a'; e.target.style.display = 'none' }
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '12px 10px 8px', textAlign: 'center' }}>
                    <p className="font-serif text-sm italic text-white">Gehna</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rarity reveal + Instagram link */}
            <AnimatePresence>
              {flipped[i] && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: 'bold',
                    color: card.rarity.includes('SUPER') ? '#fff' : '#aaa',
                    textShadow: card.rarity.includes('SUPER') ? '0 0 12px #fff' : 'none',
                    margin: '0 0 4px',
                  }}>
                    {card.rarity}
                  </p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', maxWidth: '160px', margin: '0 auto 8px' }}>
                    {card.message}
                  </p>
                  <a
                    href={card.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#fff', textDecoration: 'underline', letterSpacing: '0.1em', opacity: 0.6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    view on instagram ↗
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

    </motion.div>
  )
}

// ── PhotocardModal (easter egg) ───────────────────────────────────────────────
function PhotocardModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        <div className="w-44 rounded-xl overflow-hidden shadow-2xl" style={{ background: '#111', border: '3px solid #fff' }}>
          <div className="w-full h-64 flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <div className="text-center">
              <p className="text-4xl mb-2">📸</p>
              <p className="font-mono text-[9px]" style={{ color: '#888' }}>[ photo of Gehna ]</p>
            </div>
          </div>
          <div className="p-3 text-center" style={{ background: '#000' }}>
            <p className="font-serif text-white text-sm italic">Gehna</p>
            <p className="font-mono text-[8px] tracking-widest mt-0.5" style={{ color: '#888' }}>PHOTOCARD</p>
          </div>
        </div>
        <motion.div className="absolute -top-8 left-0 right-0 text-center" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="font-mono text-[10px] text-white tracking-widest">✦ you found it ✦</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ── PlacedStickers ────────────────────────────────────────────────────────────
function PlacedStickers({ stickers }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          drag
          dragMomentum={false}
          className="absolute text-3xl cursor-grab active:cursor-grabbing select-none pointer-events-auto"
          style={{ left: `${s.x}%`, top: `${s.y}%`, rotate: s.rotation || 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
          whileDrag={{ scale: 1.3, rotate: 15, zIndex: 100 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, repeatType: 'mirror' }}
        >
          {s.emoji}
        </motion.div>
      ))}
    </div>
  )
}
