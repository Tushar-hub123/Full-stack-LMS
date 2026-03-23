import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Static data ─────────────────────────────────────────────────────────── */
const BOOKS = [
  { id:1, title:"The Great Gatsby",      author:"F. Scott Fitzgerald", genre:"Classic",   color:"#8B4513", available:true,  rating:4.5 },
  { id:2, title:"1984",                  author:"George Orwell",       genre:"Dystopian", color:"#2C3E50", available:true,  rating:4.8 },
  { id:3, title:"To Kill a Mockingbird", author:"Harper Lee",          genre:"Fiction",   color:"#5D4037", available:false, rating:4.7 },
  { id:4, title:"Brave New World",       author:"Aldous Huxley",       genre:"Sci-Fi",    color:"#1A237E", available:true,  rating:4.3 },
  { id:5, title:"Jane Eyre",             author:"Charlotte Brontë",    genre:"Romance",   color:"#880E4F", available:true,  rating:4.6 },
  { id:6, title:"Moby Dick",             author:"Herman Melville",     genre:"Adventure", color:"#004D40", available:false, rating:4.1 },
];

const STATS = [
  { value:"50,000+", label:"Books Available"      },
  { value:"12,000+", label:"Active Members"       },
  { value:"200+",    label:"New Arrivals Monthly" },
  { value:"98%",     label:"Member Satisfaction"  },
];

const FEATURES = [
  { icon:"📚", title:"Vast Collection",      desc:"Explore over 50,000 titles spanning every genre, era, and language in our meticulously curated library."     },
  { icon:"🔖", title:"Smart Bookmarks",      desc:"Save, annotate, and organize your reading list with our intelligent bookmark system across all devices."      },
  { icon:"🔔", title:"Return Reminders",     desc:"Never pay a late fee again. Our system sends timely reminders before any book is due for return."            },
  { icon:"🤝", title:"Community Clubs",      desc:"Join reading circles, attend author talks, and connect with fellow bibliophiles in our vibrant community."    },
  { icon:"⚡", title:"Instant Reservations", desc:"Reserve books in seconds from anywhere. Pick up at your convenience without any waiting queues."              },
  { icon:"📖", title:"Digital Reading",      desc:"Access thousands of eBooks and audiobooks instantly, available 24/7 from any device you own."                },
];

const TESTIMONIALS = [
  { name:"Amelia Rhodes", role:"Literature Professor",  avatar:"AR", text:"This platform has transformed how I guide my students through literature. The collection is unparalleled." },
  { name:"Marcus Chen",   role:"Avid Reader",           avatar:"MC", text:"The reservation system is seamless. I've discovered so many hidden gems through the recommendation engine." },
  { name:"Sofia Laurent", role:"Book Club Organizer",   avatar:"SL", text:"Managing our reading club has never been easier. The community features are simply outstanding."           },
];

const TEAM = [
  { name:"Eleanor Voss",  role:"Head Librarian",  avatar:"EV", desc:"25 years curating world-class collections across three continents." },
  { name:"James Hartley", role:"Digital Director", avatar:"JH", desc:"Pioneer of modern library technology platforms since 2004."        },
  { name:"Priya Nair",    role:"Community Lead",   avatar:"PN", desc:"Building literary communities and reader programs since 2010."     },
];

const CATEGORIES = ["All","Classic","Dystopian","Fiction","Sci-Fi","Romance","Adventure"];

const CONTACT_INFO = [
  { icon:"📍", label:"Address", value:"12 Scholar's Lane, Literary Quarter" },
  { icon:"📞", label:"Phone",   value:"+1 (800) 555-0192"                  },
  { icon:"✉️", label:"Email",   value:"hello@NITKLMS.lib"              },
  { icon:"🕐", label:"Hours",   value:"Mon – Sat  8 am – 9 pm"            },
];

/* ─── CSS string (injected once via useEffect) ───────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700;900&family=Raleway:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  ::-webkit-scrollbar            { width: 6px; }
  ::-webkit-scrollbar-track      { background: #0D0A08; }
  ::-webkit-scrollbar-thumb      { background: #B8860B; border-radius: 3px; }

  @keyframes fadeUp        { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes floatBook     { 0%,100% { transform:translateY(0) rotate(-2deg); } 50% { transform:translateY(-14px) rotate(2deg); } }
  @keyframes shimmer       { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes pulseGlow     { 0%,100% { box-shadow:0 0 20px rgba(184,134,11,.3); } 50% { box-shadow:0 0 50px rgba(184,134,11,.7),0 0 80px rgba(184,134,11,.3); } }
  @keyframes scrollBounce  { 0%,100% { transform:translateY(0); opacity:1; } 50% { transform:translateY(8px); opacity:.5; } }
  @keyframes grain {
    0%,100%{transform:translate(0,0);}   10%{transform:translate(-2%,-3%);}  20%{transform:translate(1%,2%);}
    30%{transform:translate(-1%,1%);}    40%{transform:translate(2%,-1%);}   50%{transform:translate(-2%,2%);}
    60%{transform:translate(1%,-2%);}    70%{transform:translate(-1%,3%);}   80%{transform:translate(2%,1%);}
    90%{transform:translate(-2%,-1%);}
  }

  /* Entrance animations applied via className */
  .hp-hero-title { animation: fadeUp 1s ease forwards; }
  .hp-hero-sub   { animation: fadeUp 1s ease .2s forwards; opacity: 0; }
  .hp-hero-ctas  { animation: fadeUp 1s ease .4s forwards; opacity: 0; }
  .hp-hero-badge { animation: fadeUp 1s ease .6s forwards; opacity: 0; }

  .hp-book-float                  { animation: floatBook 5s ease-in-out infinite; }
  .hp-book-float:nth-child(2)     { animation-delay: 1.5s; }
  .hp-book-float:nth-child(3)     { animation-delay: 3s;   }

  /* Shimmer gold text */
  .hp-gold {
    background: linear-gradient(90deg,#B8860B,#FFD700,#B8860B,#DAA520,#B8860B);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* Grain film overlay */
  .hp-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: .025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: grain .5s steps(1) infinite;
  }

  /* Nav links */
  .hp-nav-link {
    position: relative; background: none; border: none;
    color: #C4B89A; font-family: 'Raleway', sans-serif;
    font-size: .85rem; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; cursor: pointer;
    padding-bottom: 4px; transition: color .3s;
  }
  .hp-nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 1px; background: #B8860B; transition: width .3s ease;
  }
  .hp-nav-link:hover { color: #DAA520; }
  .hp-nav-link:hover::after { width: 100%; }

  /* Buttons */
  .hp-btn-primary {
    background: linear-gradient(135deg, #B8860B, #DAA520);
    color: #0D0A08; border: none; cursor: pointer;
    font-family: 'Raleway', sans-serif; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    transition: all .3s ease; position: relative; overflow: hidden;
  }
  .hp-btn-primary::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: rgba(255,255,255,.2);
    border-radius: 50%; transform: translate(-50%,-50%);
    transition: width .6s, height .6s;
  }
  .hp-btn-primary:hover::before  { width: 300px; height: 300px; }
  .hp-btn-primary:hover          { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(184,134,11,.4); }

  .hp-btn-outline {
    background: transparent; color: #DAA520;
    border: 1px solid #B8860B; cursor: pointer;
    font-family: 'Raleway', sans-serif; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; transition: all .3s;
  }
  .hp-btn-outline:hover {
    background: rgba(184,134,11,.1); border-color: #DAA520;
    transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184,134,11,.2);
  }

  /* Cards */
  .hp-book-card {
    transition: all .4s cubic-bezier(.175,.885,.32,1.275);
    cursor: pointer; position: relative; overflow: hidden;
  }
  .hp-book-card:hover          { transform: translateY(-10px) scale(1.02); box-shadow: 0 25px 60px rgba(0,0,0,.6), 0 0 30px rgba(184,134,11,.15); }
  .hp-book-card::before        { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(184,134,11,.08),transparent); opacity: 0; transition: opacity .3s; }
  .hp-book-card:hover::before  { opacity: 1; }

  .hp-feature-card             { transition: all .3s ease; border: 1px solid rgba(184,134,11,.1); position: relative; overflow: hidden; }
  .hp-feature-card::before     { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(90deg,#B8860B,#DAA520); transition: width .4s ease; }
  .hp-feature-card:hover::before { width: 100%; }
  .hp-feature-card:hover       { border-color: rgba(184,134,11,.35); transform: translateY(-4px); background: rgba(184,134,11,.05) !important; }

  .hp-stat-card                { border: 1px solid rgba(184,134,11,.2); transition: all .3s; animation: pulseGlow 4s ease-in-out infinite; }
  .hp-stat-card:nth-child(2)   { animation-delay: 1s; }
  .hp-stat-card:nth-child(3)   { animation-delay: 2s; }
  .hp-stat-card:nth-child(4)   { animation-delay: 3s; }
  .hp-stat-card:hover          { border-color: #DAA520; transform: scale(1.04); }

  .hp-testimonial-card         { transition: all .3s ease; border: 1px solid rgba(184,134,11,.1); }
  .hp-testimonial-card:hover   { border-color: rgba(184,134,11,.3); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,.4); }

  .hp-team-card                { border: 1px solid rgba(184,134,11,.12); transition: all .3s ease; }
  .hp-team-card:hover          { border-color: rgba(184,134,11,.35); transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,.5); }

  /* Category filter buttons */
  .hp-cat-btn {
    font-family: 'Raleway', sans-serif; font-size: .78rem; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; cursor: pointer;
    transition: all .2s; border: 1px solid rgba(184,134,11,.25);
  }
  .hp-cat-btn:hover { border-color: #B8860B; color: #DAA520; background: rgba(184,134,11,.08); }

  /* Search input */
  .hp-search {
    background: rgba(255,255,255,.04); border: 1px solid rgba(184,134,11,.25);
    color: #F5F0E8; outline: none; font-family: 'EB Garamond', serif; transition: all .3s;
  }
  .hp-search:focus           { border-color: #B8860B; background: rgba(184,134,11,.06); box-shadow: 0 0 0 3px rgba(184,134,11,.1); }
  .hp-search::placeholder    { color: rgba(196,184,154,.45); }

  /* Mobile drawer */
  .hp-mobile-menu            { position: fixed; top: 0; right: 0; width: 280px; height: 100vh; background: #110E0A; border-left: 1px solid rgba(184,134,11,.2); z-index: 200; padding: 80px 40px 40px; transform: translateX(100%); transition: transform .4s cubic-bezier(.77,0,.175,1); display: flex; flex-direction: column; gap: 28px; }
  .hp-mobile-menu.open       { transform: translateX(0); }
  .hp-mobile-overlay         { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 199; opacity: 0; pointer-events: none; transition: opacity .4s; }
  .hp-mobile-overlay.open    { opacity: 1; pointer-events: all; }

  .hp-ornament { color: #B8860B; opacity: .6; }

  /* Responsive */
  @media (max-width: 900px) {
    .hp-about-grid  { grid-template-columns: 1fr !important; }
    .hp-footer-grid { grid-template-columns: 1fr 1fr !important; }
    .hp-desktop-nav { display: none !important; }
  }
  @media (max-width: 600px) {
    .hp-footer-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();

  const [menuOpen,       setMenuOpen]       = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const aboutRef  = useRef(null);
  const footerRef = useRef(null);

  /* Inject global CSS + Google Fonts once on mount */
  useEffect(() => {
    const styleId = "NITKLMS-home-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.textContent = GLOBAL_CSS;
      document.head.appendChild(tag);
    }
    return () => {
      // optional cleanup — remove on unmount so styles don't bleed
      const tag = document.getElementById(styleId);
      if (tag) tag.remove();
    };
  }, []);

  /* Sticky nav */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (ref) => {
    setMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToBooks = (query = "") =>
    navigate(query.trim() ? `/books?search=${encodeURIComponent(query.trim())}` : "/books");

  const filteredBooks = BOOKS.filter((b) => {
    const matchCat = activeCategory === "All" || b.genre === activeCategory;
    const matchQ   = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  /* ── Shared inline style fragments ── */
  const S = {
    section:    (extra = {}) => ({ padding:"100px 32px", position:"relative", zIndex:1, ...extra }),
    container:  { maxWidth:"1280px", margin:"0 auto" },
    sectionHead: { textAlign:"center", marginBottom:"64px" },
    eyebrow:    { fontFamily:"'Raleway',sans-serif", fontSize:".72rem", letterSpacing:".3em", color:"#B8860B", textTransform:"uppercase", marginBottom:"16px" },
    h2:         { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"clamp(2rem,5vw,3.5rem)", color:"#F5F0E8" },
    divider:    { width:"60px", height:"2px", background:"linear-gradient(90deg,transparent,#B8860B,transparent)", margin:"28px auto 0" },
    avatar:     { width:"46px", height:"46px", borderRadius:"50%", background:"linear-gradient(135deg,#B8860B,#DAA520)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:".85rem", color:"#0D0A08" },
  };

  /* ── Corner ornament helper ── */
  const Corners = () => (
    <>
      {["tl","tr","bl","br"].map((c) => (
        <div key={c} style={{ position:"absolute", ...(c[0]==="t"?{top:"16px"}:{bottom:"16px"}), ...(c[1]==="l"?{left:"16px"}:{right:"16px"}), color:"#B8860B", opacity:.4, fontSize:"14px" }}>✦</div>
      ))}
    </>
  );

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily:"'EB Garamond',Georgia,serif", background:"#0D0A08", color:"#F5F0E8", minHeight:"100vh", overflowX:"hidden" }}>

      {/* Grain film */}
      <div className="hp-grain" />

      {/* Ambient radial glows */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-10%", left:"-10%", width:"60%", height:"60%", background:"radial-gradient(ellipse,rgba(184,134,11,.06) 0%,transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"-5%",  width:"50%", height:"50%", background:"radial-gradient(ellipse,rgba(139,69,19,.05) 0%,transparent 70%)",  borderRadius:"50%" }} />
        <div style={{ position:"absolute", top:"40%",   left:"40%",    width:"40%", height:"40%", background:"radial-gradient(ellipse,rgba(184,134,11,.04) 0%,transparent 70%)", borderRadius:"50%" }} />
      </div>


      {/* ══════════════════════════════════════════════════════
          NAVBAR
          Home     → scroll top
          Explore  → /books
          Categories → /books
          About    → smooth scroll to #about
          Contact  → smooth scroll to footer
          Sign In  → /login
          Join Free → /signup
      ══════════════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(13,10,8,.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,134,11,.15)" : "none",
        transition: "all .4s ease",
      }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* Logo */}
          <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"40px", height:"40px", border:"2px solid #B8860B", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", animation:"pulseGlow 3s ease-in-out infinite" }}>📚</div>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1.2rem", letterSpacing:".08em" }} className="hp-gold">NITKLMS</div>
              <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".58rem", letterSpacing:".25em", color:"#8B7355", textTransform:"uppercase", marginTop:"-2px" }}>Library Management</div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hp-desktop-nav" style={{ display:"flex", alignItems:"center", gap:"36px" }}>
            <button className="hp-nav-link" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>Home</button>
            <button className="hp-nav-link" onClick={() => goToBooks()}>Explore</button>
            <button className="hp-nav-link" onClick={() => goToBooks()}>Categories</button>
            <button className="hp-nav-link" onClick={() => scrollTo(aboutRef)}>About</button>
            <button className="hp-nav-link" onClick={() => scrollTo(footerRef)}>Contact</button>
          </div>

          {/* Auth */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <button className="hp-btn-outline" style={{ padding:"8px 22px", fontSize:".75rem", borderRadius:"2px" }}
              onClick={() => navigate("/login")}>Sign In</button>
            <button className="hp-btn-primary" style={{ padding:"8px 22px", fontSize:".75rem", borderRadius:"2px" }}
              onClick={() => navigate("/signup")}>Join Free</button>
            <button onClick={() => setMenuOpen(true)}
              style={{ background:"none", border:"none", color:"#B8860B", cursor:"pointer", fontSize:"22px", marginLeft:"8px" }}>☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay + drawer */}
      <div className={`hp-mobile-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`hp-mobile-menu   ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)}
          style={{ position:"absolute", top:"24px", right:"24px", background:"none", border:"none", color:"#B8860B", fontSize:"24px", cursor:"pointer" }}>✕</button>
        {[
          { label:"Home",       action:() => { window.scrollTo({ top:0, behavior:"smooth" }); setMenuOpen(false); } },
          { label:"Explore",    action:() => { goToBooks(); setMenuOpen(false); } },
          { label:"Categories", action:() => { goToBooks(); setMenuOpen(false); } },
          { label:"About",      action:() => scrollTo(aboutRef)  },
          { label:"Contact",    action:() => scrollTo(footerRef) },
        ].map(({ label, action }) => (
          <button key={label} className="hp-nav-link" style={{ fontSize:"1rem" }} onClick={action}>{label}</button>
        ))}
        <div style={{ borderTop:"1px solid rgba(184,134,11,.2)", paddingTop:"24px", display:"flex", flexDirection:"column", gap:"12px", marginTop:"auto" }}>
          <button className="hp-btn-outline" style={{ padding:"12px", fontSize:".8rem", borderRadius:"2px" }}
            onClick={() => { navigate("/login");  setMenuOpen(false); }}>Sign In</button>
          <button className="hp-btn-primary"  style={{ padding:"12px", fontSize:".8rem", borderRadius:"2px" }}
            onClick={() => { navigate("/signup"); setMenuOpen(false); }}>Join Free</button>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", padding:"120px 32px 80px", zIndex:1 }}>
        {/* Floating decoration */}
        <div style={{ position:"absolute", right:"5%",  top:"15%",    opacity:.12, fontSize:"180px", pointerEvents:"none" }} className="hp-book-float">📖</div>
        <div style={{ position:"absolute", left:"3%",   bottom:"20%", opacity:.08, fontSize:"120px", pointerEvents:"none" }} className="hp-book-float">📚</div>
        <div style={{ position:"absolute", right:"18%", bottom:"10%", opacity:.07, fontSize:"80px",  pointerEvents:"none" }} className="hp-book-float">📕</div>
        <div style={{ position:"absolute", left:0,  top:"50%", width:"8%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(184,134,11,.4))"  }} />
        <div style={{ position:"absolute", right:0, top:"50%", width:"8%", height:"1px", background:"linear-gradient(270deg,transparent,rgba(184,134,11,.4))" }} />

        <div style={{ maxWidth:"900px", textAlign:"center", position:"relative" }}>

          {/* Pill badge */}
          <div className="hp-hero-badge" style={{ display:"inline-flex", alignItems:"center", gap:"10px", border:"1px solid rgba(184,134,11,.35)", padding:"6px 18px", borderRadius:"100px", marginBottom:"32px", fontFamily:"'Raleway',sans-serif", fontSize:".72rem", letterSpacing:".18em", color:"#DAA520", textTransform:"uppercase" }}>
            <span style={{ width:"6px", height:"6px", background:"#DAA520", borderRadius:"50%", animation:"pulseGlow 2s infinite" }} />
            Now with Digital &amp; Audio Collections
          </div>

          {/* Eyebrow */}
          <div className="hp-hero-sub" style={{ fontSize:".9rem", fontFamily:"'Raleway',sans-serif", letterSpacing:".3em", color:"#8B7355", textTransform:"uppercase", marginBottom:"16px" }}>
            <span className="hp-ornament">✦</span> Your Literary Sanctuary <span className="hp-ornament">✦</span>
          </div>

          {/* Headline */}
          <h1 className="hp-hero-title" style={{ fontFamily:"'Cinzel',serif", fontWeight:700, lineHeight:1.05, marginBottom:"28px" }}>
            <span style={{ display:"block", fontSize:"clamp(3.5rem,9vw,7.5rem)", letterSpacing:"-.02em", color:"#F5F0E8" }}>The Art of</span>
            <span style={{ display:"block", fontSize:"clamp(3.5rem,9vw,7.5rem)", letterSpacing:"-.02em" }} className="hp-gold">Reading Lives</span>
            <span style={{ display:"block", fontSize:"clamp(3.5rem,9vw,7.5rem)", letterSpacing:"-.02em", color:"#F5F0E8" }}>Here.</span>
          </h1>

          <p className="hp-hero-sub" style={{ fontSize:"clamp(1rem,2vw,1.25rem)", color:"#C4B89A", lineHeight:1.8, maxWidth:"600px", margin:"0 auto 48px", fontStyle:"italic" }}>
            Discover, borrow, and explore over 50,000 titles from our curated library. Where every page turn opens a new world of knowledge and wonder.
          </p>

          {/* CTAs */}
          <div className="hp-hero-ctas" style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", marginBottom:"64px" }}>
            <button className="hp-btn-primary" style={{ padding:"16px 40px", fontSize:".85rem", borderRadius:"2px", display:"flex", alignItems:"center", gap:"10px" }}
              onClick={() => goToBooks()}>
              <span>📚</span> Explore the Collection
            </button>
            <button className="hp-btn-outline" style={{ padding:"16px 40px", fontSize:".85rem", borderRadius:"2px", display:"flex", alignItems:"center", gap:"10px" }}
              onClick={() => navigate("/signup")}>
              <span>✨</span> Create Free Account
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position:"relative", maxWidth:"580px", margin:"0 auto" }}>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToBooks(searchQuery)}
              className="hp-search"
              style={{ width:"100%", padding:"16px 60px 16px 24px", borderRadius:"2px", fontSize:"1rem" }}
            />
            <button className="hp-btn-primary"
              onClick={() => goToBooks(searchQuery)}
              style={{ position:"absolute", right:0, top:0, bottom:0, padding:"0 24px", fontSize:".8rem", borderRadius:"0 2px 2px 0", display:"flex", alignItems:"center" }}>
              🔍
            </button>
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop:"64px", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", color:"#8B7355" }}>
            <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:".7rem", letterSpacing:".2em", textTransform:"uppercase" }}>Scroll to Explore</span>
            <div style={{ width:"1px", height:"40px", background:"linear-gradient(to bottom,#B8860B,transparent)", animation:"scrollBounce 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:"80px 32px", position:"relative", zIndex:1, borderTop:"1px solid rgba(184,134,11,.1)", borderBottom:"1px solid rgba(184,134,11,.1)" }}>
        <div style={S.container}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"24px" }}>
            {STATS.map((s, i) => (
              <div key={i} className="hp-stat-card" style={{ padding:"36px 24px", textAlign:"center", borderRadius:"4px", background:"rgba(184,134,11,.04)", animationDelay:`${i * .8}s` }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2rem,4vw,2.8rem)", fontWeight:700 }} className="hp-gold">{s.value}</div>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".8rem", letterSpacing:".15em", color:"#8B7355", textTransform:"uppercase", marginTop:"8px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FEATURED BOOKS
      ══════════════════════════════════════════════════════ */}
      <section style={S.section()}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <div style={S.eyebrow}><span className="hp-ornament">✦</span> Curated Selection <span className="hp-ornament">✦</span></div>
            <h2 style={S.h2}>Explore the Collection</h2>
            <p style={{ color:"#8B7355", fontSize:"1.05rem", maxWidth:"500px", margin:"20px auto 0", fontStyle:"italic", lineHeight:1.7 }}>From timeless classics to contemporary masterpieces — find your next great read.</p>
            <div style={S.divider} />
          </div>

          {/* Category filters */}
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center", marginBottom:"48px" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} className="hp-cat-btn"
                onClick={() => setActiveCategory(cat)}
                style={{ padding:"8px 20px", borderRadius:"2px",
                  background:  activeCategory === cat ? "rgba(184,134,11,.2)" : "transparent",
                  color:       activeCategory === cat ? "#DAA520" : "#8B7355",
                  borderColor: activeCategory === cat ? "#B8860B" : "rgba(184,134,11,.2)",
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Book grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"28px" }}>
            {filteredBooks.map((book) => (
              <div key={book.id} className="hp-book-card"
                onClick={() => goToBooks()}
                style={{ background:"#110E0A", border:"1px solid rgba(184,134,11,.12)", borderRadius:"4px", overflow:"hidden" }}>

                {/* Cover */}
                <div style={{ height:"200px", background:`linear-gradient(145deg,${book.color},${book.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,.5))" }} />
                  <div style={{ fontSize:"64px", opacity:.6, filter:"drop-shadow(0 4px 8px rgba(0,0,0,.5))", position:"relative" }}>📖</div>
                  <div style={{ position:"absolute", top:"14px", right:"14px", padding:"4px 12px", borderRadius:"100px", fontFamily:"'Raleway',sans-serif", fontSize:".65rem", letterSpacing:".1em", fontWeight:600, textTransform:"uppercase",
                    background: book.available ? "rgba(34,197,94,.2)"        : "rgba(239,68,68,.2)",
                    color:      book.available ? "#4ade80"                   : "#f87171",
                    border:     book.available ? "1px solid rgba(74,222,128,.3)" : "1px solid rgba(248,113,113,.3)",
                  }}>
                    {book.available ? "✓ Available" : "Borrowed"}
                  </div>
                  <div style={{ position:"absolute", bottom:"12px", left:"14px", padding:"3px 10px", borderRadius:"1px", fontFamily:"'Raleway',sans-serif", fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase", color:"#DAA520", background:"rgba(13,10,8,.7)", backdropFilter:"blur(8px)", border:"1px solid rgba(184,134,11,.3)" }}>
                    {book.genre}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding:"22px" }}>
                  <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:"1rem", fontWeight:600, color:"#F5F0E8", marginBottom:"6px", lineHeight:1.3 }}>{book.title}</h3>
                  <p  style={{ fontFamily:"'Raleway',sans-serif", fontSize:".78rem", color:"#8B7355", letterSpacing:".05em", marginBottom:"16px", fontStyle:"italic" }}>{book.author}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
                    <div style={{ display:"flex", gap:"2px" }}>
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} style={{ color: s <= Math.floor(book.rating) ? "#DAA520" : "rgba(184,134,11,.3)", fontSize:"12px" }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontFamily:"'Raleway',sans-serif", fontSize:".72rem", color:"#8B7355" }}>{book.rating}</span>
                  </div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button className="hp-btn-primary" style={{ flex:1, padding:"9px 0", fontSize:".7rem", borderRadius:"2px" }}
                      onClick={(e) => { e.stopPropagation(); navigate("/login/student"); }}>
                      {book.available ? "Reserve" : "Waitlist"}
                    </button>
                    <button className="hp-btn-outline" style={{ padding:"9px 14px", fontSize:".7rem", borderRadius:"2px" }}
                      onClick={(e) => { e.stopPropagation(); goToBooks(); }}>
                      ℹ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:"56px" }}>
            <button className="hp-btn-outline" style={{ padding:"16px 48px", fontSize:".82rem", borderRadius:"2px", display:"inline-flex", alignItems:"center", gap:"10px" }}
              onClick={() => goToBooks()}>
              View All 50,000+ Books →
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section style={S.section({ background:"rgba(184,134,11,.03)", borderTop:"1px solid rgba(184,134,11,.1)", borderBottom:"1px solid rgba(184,134,11,.1)" })}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <div style={S.eyebrow}><span className="hp-ornament">✦</span> Why NITKLMS <span className="hp-ornament">✦</span></div>
            <h2 style={S.h2}>Everything You Need</h2>
            <div style={S.divider} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"24px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="hp-feature-card" style={{ padding:"36px 32px", background:"rgba(13,10,8,.6)", borderRadius:"4px", backdropFilter:"blur(10px)" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"20px" }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:"1.05rem", fontWeight:600, color:"#F5F0E8", marginBottom:"12px" }}>{f.title}</h3>
                <p  style={{ fontFamily:"'Raleway',sans-serif", fontSize:".85rem", color:"#8B7355", lineHeight:1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          ABOUT  ← "About" nav button scrolls here
      ══════════════════════════════════════════════════════ */}
      <section ref={aboutRef} id="about" style={S.section({ paddingTop:"110px", scrollMarginTop:"80px" })}>
        <div style={S.container}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"72px" }}>
            <div style={S.eyebrow}><span className="hp-ornament">✦</span> Our Story <span className="hp-ornament">✦</span></div>
            <h2 style={S.h2}>About NITKLMS</h2>
            <div style={{ ...S.divider, margin:"28px auto 40px" }} />
            <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"clamp(1rem,2vw,1.2rem)", color:"#C4B89A", lineHeight:2, maxWidth:"760px", margin:"0 auto", fontStyle:"italic" }}>
              Founded in 1892, NITKLMS has stood as a beacon of knowledge and culture for over a century. What began as a modest reading room of 400 volumes has grown into one of the most comprehensive digital and physical library networks in the world.
            </p>
          </div>

          {/* Two-col: mission + quote */}
          <div className="hp-about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center", marginBottom:"80px" }}>
            <div>
              <div style={{ ...S.eyebrow, marginBottom:"16px" }}>Our Mission</div>
              <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", color:"#F5F0E8", marginBottom:"20px", lineHeight:1.3 }}>
                Preserving the Art of<br />Reading for Everyone
              </h3>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:".9rem", color:"#8B7355", lineHeight:1.9, marginBottom:"20px" }}>
                We believe that access to knowledge should be universal. Our mission is to democratize reading by blending the warmth of traditional libraries with the reach of modern technology.
              </p>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:".9rem", color:"#8B7355", lineHeight:1.9, marginBottom:"32px" }}>
                From rare manuscripts to bestselling novels, from children's picture books to doctoral dissertations — NITKLMS holds space for every story worth telling.
              </p>
              <button className="hp-btn-primary" style={{ padding:"14px 36px", fontSize:".82rem", borderRadius:"2px" }}
                onClick={() => navigate("/signup")}>
                Join Our Community
              </button>
            </div>

            {/* Quote block */}
            <div style={{ position:"relative", border:"1px solid rgba(184,134,11,.2)", borderRadius:"4px", padding:"48px 44px", background:"rgba(184,134,11,.03)" }}>
              <Corners />
              <div style={{ fontSize:"5rem", color:"rgba(184,134,11,.15)", fontFamily:"'Cinzel',serif", lineHeight:1, marginBottom:"20px" }}>"</div>
              <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"1.2rem", color:"#C4B89A", lineHeight:1.85, fontStyle:"italic", marginBottom:"28px" }}>
                A library is not a luxury but one of the necessities of life. Within its walls lie infinite possibilities — every question answered, every dream seeded.
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <div style={{ width:"2px", height:"36px", background:"linear-gradient(to bottom,#B8860B,transparent)" }} />
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:".9rem", color:"#DAA520" }}>Henry Ward Beecher</div>
                  <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".72rem", color:"#8B7355", marginTop:"2px" }}>American Author, 1813 – 1887</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <div style={S.eyebrow}>The People Behind It</div>
            <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", color:"#F5F0E8" }}>Meet Our Team</h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"24px" }}>
            {TEAM.map((m, i) => (
              <div key={i} className="hp-team-card" style={{ padding:"36px 28px", background:"#110E0A", borderRadius:"4px", textAlign:"center" }}>
                <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"linear-gradient(135deg,#B8860B,#DAA520)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1.1rem", color:"#0D0A08", margin:"0 auto 20px" }}>{m.avatar}</div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1rem", fontWeight:600, color:"#F5F0E8", marginBottom:"6px" }}>{m.name}</div>
                <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".72rem", letterSpacing:".1em", color:"#B8860B", textTransform:"uppercase", marginBottom:"14px" }}>{m.role}</div>
                <p   style={{ fontFamily:"'Raleway',sans-serif", fontSize:".82rem", color:"#8B7355", lineHeight:1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section style={S.section({ background:"rgba(184,134,11,.02)", borderTop:"1px solid rgba(184,134,11,.08)" })}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <div style={S.eyebrow}><span className="hp-ornament">✦</span> From Our Members <span className="hp-ornament">✦</span></div>
            <h2 style={S.h2}>Voices of the Library</h2>
            <div style={S.divider} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"28px" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="hp-testimonial-card" style={{ padding:"40px 36px", background:"#110E0A", borderRadius:"4px" }}>
                <div style={{ fontSize:"3rem", color:"rgba(184,134,11,.25)", fontFamily:"'Cinzel',serif", lineHeight:1, marginBottom:"20px" }}>"</div>
                <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"1.05rem", color:"#C4B89A", lineHeight:1.8, fontStyle:"italic", marginBottom:"28px" }}>{t.text}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                  <div style={S.avatar}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:".9rem", fontWeight:600, color:"#F5F0E8" }}>{t.name}</div>
                    <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".72rem", letterSpacing:".08em", color:"#8B7355", marginTop:"2px" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section style={S.section()}>
        <div style={{ maxWidth:"800px", margin:"0 auto", textAlign:"center" }}>
          <div style={{ position:"relative", padding:"72px 56px", border:"1px solid rgba(184,134,11,.25)", borderRadius:"4px", background:"linear-gradient(135deg,rgba(184,134,11,.06),rgba(13,10,8,.8))", overflow:"hidden" }}>
            <Corners />
            <div style={S.eyebrow}>Begin Your Journey</div>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"clamp(1.8rem,4vw,3rem)", color:"#F5F0E8", margin:"16px 0 20px", lineHeight:1.2 }}>
              Open the Door to<br /><span className="hp-gold">Infinite Stories</span>
            </h2>
            <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"1.1rem", color:"#8B7355", lineHeight:1.8, fontStyle:"italic", marginBottom:"40px" }}>
              Join thousands of readers who have made NITKLMS their literary home. Free membership. Unlimited possibilities.
            </p>
            <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
              <button className="hp-btn-primary" style={{ padding:"16px 44px", fontSize:".85rem", borderRadius:"2px" }}
                onClick={() => navigate("/signup")}>Create Free Account</button>
              <button className="hp-btn-outline" style={{ padding:"16px 44px", fontSize:".85rem", borderRadius:"2px" }}
                onClick={() => navigate("/login")}>Sign In</button>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FOOTER  ← "Contact" nav button scrolls here
      ══════════════════════════════════════════════════════ */}
      <footer ref={footerRef} id="contact"
        style={{ padding:"60px 32px 36px", borderTop:"1px solid rgba(184,134,11,.15)", position:"relative", zIndex:1, scrollMarginTop:"80px" }}>
        <div style={S.container}>

          {/* Contact info strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"24px", marginBottom:"56px", padding:"40px", border:"1px solid rgba(184,134,11,.12)", borderRadius:"4px", background:"rgba(184,134,11,.03)" }}>
            {CONTACT_INFO.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"14px" }}>
                <span style={{ fontSize:"1.4rem", marginTop:"2px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:".68rem", letterSpacing:".15em", color:"#B8860B", textTransform:"uppercase", marginBottom:"4px" }}>{item.label}</div>
                  <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"1rem", color:"#C4B89A" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Link columns */}
          <div className="hp-footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"48px", marginBottom:"60px" }}>

            {/* Brand */}
            <div>
              <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
                style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px", padding:0 }}>
                <span style={{ fontSize:"24px" }}>📚</span>
                <span style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1.2rem" }} className="hp-gold">NITKLMS</span>
              </button>
              <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:".82rem", color:"#8B7355", lineHeight:1.9, maxWidth:"280px" }}>
                A digital sanctuary for readers and scholars alike. Preserving the art of reading in the modern age.
              </p>
              <div style={{ display:"flex", gap:"14px", marginTop:"24px" }}>
                {["𝕏","📘","📸","💼"].map((icon, i) => (
                  <button key={i}
                    style={{ width:"36px", height:"36px", border:"1px solid rgba(184,134,11,.25)", background:"transparent", color:"#8B7355", borderRadius:"2px", cursor:"pointer", fontSize:"14px", transition:"all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor="#B8860B"; e.currentTarget.style.color="#DAA520"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(184,134,11,.25)"; e.currentTarget.style.color="#8B7355"; }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer nav cols */}
            {[
              { title:"Explore",
                links:[
                  { l:"All Books",    fn:() => goToBooks()          },
                  { l:"New Arrivals", fn:() => goToBooks()          },
                  { l:"Bestsellers",  fn:() => goToBooks()          },
                  { l:"Categories",   fn:() => goToBooks()          },
                  { l:"Authors",      fn:() => goToBooks()          },
                ]},
              { title:"Account",
                links:[
                  { l:"Sign Up",    fn:() => navigate("/signup")            },
                  { l:"Sign In",    fn:() => navigate("/login")             },
                  { l:"My Library", fn:() => navigate("/student/dashboard") },
                  { l:"History",    fn:() => navigate("/student/dashboard") },
                  { l:"Settings",   fn:() => navigate("/student/dashboard") },
                ]},
              { title:"Library",
                links:[
                  { l:"About Us",   fn:() => scrollTo(aboutRef)  },
                  { l:"Membership", fn:() => navigate("/signup")  },
                  { l:"Events",     fn:() => goToBooks()          },
                  { l:"Contact",    fn:() => scrollTo(footerRef)  },
                  { l:"Help",       fn:() => navigate("/login")   },
                ]},
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:".82rem", letterSpacing:".15em", color:"#DAA520", marginBottom:"20px", textTransform:"uppercase" }}>{col.title}</h4>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"10px" }}>
                  {col.links.map((link) => (
                    <li key={link.l}>
                      <button onClick={link.fn}
                        style={{ fontFamily:"'Raleway',sans-serif", fontSize:".82rem", color:"#8B7355", background:"none", border:"none", cursor:"pointer", transition:"color .2s", padding:0 }}
                        onMouseEnter={(e) => e.currentTarget.style.color="#C4B89A"}
                        onMouseLeave={(e) => e.currentTarget.style.color="#8B7355"}>
                        {link.l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:"1px solid rgba(184,134,11,.1)", paddingTop:"28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
            <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:".75rem", color:"#8B7355", letterSpacing:".05em" }}>
              © 2026 Bibliotheca Library Management. All rights reserved.
            </p>
            <p style={{ fontFamily:"'EB Garamond',serif", fontSize:".85rem", color:"rgba(184,134,11,.4)", fontStyle:"italic" }}>
              <span className="hp-ornament">✦</span> Where Every Book Finds Its Reader <span className="hp-ornament">✦</span>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
