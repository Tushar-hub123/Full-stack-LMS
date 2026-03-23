import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", rollNo: "", password: "", confirm: "" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())        return "Full name is required.";
    if (!form.email.trim())       return "Email address is required.";
    if (!form.rollNo.trim())      return "Roll number is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const submit = async () => {
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name, email: form.email,
        rollNo: form.rollNo, password: form.password, role: "student",
      });
      setSuccess(true);
      setTimeout(() => navigate("/login/student"), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && submit();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(184,134,11,.3);}50%{box-shadow:0 0 50px rgba(184,134,11,.6);}}
        @keyframes grain{0%,100%{transform:translate(0,0);}10%{transform:translate(-2%,-3%);}20%{transform:translate(1%,2%);}30%{transform:translate(-1%,1%);}40%{transform:translate(2%,-1%);}50%{transform:translate(-2%,2%);}60%{transform:translate(1%,-2%);}70%{transform:translate(-1%,3%);}80%{transform:translate(2%,1%);}90%{transform:translate(-2%,-1%);}}
        @keyframes success-pop{0%{transform:scale(.8);opacity:0;}100%{transform:scale(1);opacity:1;}}
        @keyframes progress{from{width:0;}to{width:100%;}}

        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#0D0A08;}::-webkit-scrollbar-thumb{background:#B8860B;border-radius:3px;}

        .su-page{min-height:100vh;background:#0D0A08;display:flex;font-family:'Raleway',sans-serif;color:#F5F0E8;position:relative;overflow:hidden;}
        .grain-ol{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");animation:grain .5s steps(1) infinite;}

        .su-left{width:42%;background:linear-gradient(155deg,#110D09 0%,#1A1108 50%,#0D0A08 100%);border-right:1px solid rgba(184,134,11,.12);display:flex;flex-direction:column;justify-content:space-between;padding:56px 52px;position:relative;overflow:hidden;}
        .su-left::before{content:'';position:absolute;bottom:-100px;left:-80px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(184,134,11,.07) 0%,transparent 70%);}
        .su-left::after{content:'';position:absolute;top:-40px;right:-40px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(139,69,19,.06) 0%,transparent 70%);}

        .su-brand{display:flex;align-items:center;gap:12px;position:relative;z-index:1;cursor:pointer;background:none;border:none;}
        .su-brand-icon{width:44px;height:44px;border:2px solid #B8860B;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:20px;animation:pulse-glow 3s ease-in-out infinite;}
        .gold-sh{background:linear-gradient(90deg,#B8860B,#FFD700,#B8860B,#DAA520,#B8860B);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite;}

        .su-lb{position:relative;z-index:1;}
        .su-eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#B8860B;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
        .su-eyebrow::before{content:'';width:28px;height:1px;background:#B8860B;}
        .su-lt{font-family:'Cinzel',serif;font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:700;line-height:1.1;color:#F5F0E8;margin-bottom:18px;}
        .su-ld{font-family:'EB Garamond',serif;font-size:1.05rem;color:#8B7355;line-height:1.8;max-width:310px;font-style:italic;}

        .su-perks{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1;}
        .su-perk{display:flex;align-items:center;gap:14px;padding:13px 18px;background:rgba(184,134,11,.04);border:1px solid rgba(184,134,11,.1);border-radius:4px;font-size:.85rem;color:#C4B89A;transition:all .2s;}
        .su-perk:hover{border-color:rgba(184,134,11,.28);background:rgba(184,134,11,.07);}

        .su-right{flex:1;display:flex;align-items:center;justify-content:center;padding:56px 52px;background:#0D0A08;overflow-y:auto;}
        .su-fw{width:100%;max-width:440px;animation:fadeUp .7s ease forwards;}

        .su-ft{margin-bottom:32px;}
        .su-title{font-family:'Cinzel',serif;font-size:2rem;font-weight:700;color:#F5F0E8;margin-bottom:6px;}
        .su-sub{font-size:.88rem;color:#8B7355;}

        .su-row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .su-field{margin-bottom:16px;}
        .su-label{display:block;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#8B7355;margin-bottom:7px;}
        .su-iw{position:relative;}
        .su-input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(184,134,11,.18);border-radius:2px;padding:13px 18px;color:#F5F0E8;font-family:'Raleway',sans-serif;font-size:.92rem;outline:none;transition:border-color .25s,box-shadow .25s,background .25s;}
        .su-input:focus{border-color:#B8860B;background:rgba(184,134,11,.05);box-shadow:0 0 0 3px rgba(184,134,11,.09);}
        .su-input::placeholder{color:rgba(196,184,154,.35);}
        .su-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:transparent;border:none;cursor:pointer;font-size:1rem;opacity:.45;transition:opacity .2s;}
        .su-eye:hover{opacity:.9;}

        .su-div{display:flex;align-items:center;gap:12px;margin:2px 0 18px;}
        .su-div-line{flex:1;height:1px;background:rgba(184,134,11,.12);}
        .su-div-txt{font-size:.7rem;color:#8B7355;letter-spacing:.1em;text-transform:uppercase;}

        .su-btn{width:100%;padding:15px;border:none;border-radius:2px;background:linear-gradient(135deg,#B8860B,#DAA520);color:#0D0A08;font-family:'Raleway',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;letter-spacing:.08em;text-transform:uppercase;transition:all .3s ease;position:relative;overflow:hidden;margin-top:6px;}
        .su-btn::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;background:rgba(255,255,255,.2);border-radius:50%;transform:translate(-50%,-50%);transition:width .6s,height .6s;}
        .su-btn:hover::before{width:400px;height:400px;}
        .su-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px rgba(184,134,11,.35);}
        .su-btn:disabled{opacity:.65;cursor:wait;}

        .su-err{display:flex;align-items:flex-start;gap:10px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:2px;padding:13px 16px;color:#f87171;font-size:.85rem;margin-top:14px;line-height:1.5;}

        /* ── Already have an account ── */
        .su-have{text-align:center;margin-top:26px;font-size:.86rem;color:#8B7355;}
        .su-signin{background:none;border:none;cursor:pointer;color:#DAA520;font-family:'Raleway',sans-serif;font-size:.86rem;font-weight:600;letter-spacing:.03em;text-decoration:underline;text-underline-offset:3px;transition:color .2s;padding:0;}
        .su-signin:hover{color:#FFD700;}

        .su-back{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;color:#8B7355;cursor:pointer;background:none;border:none;margin-top:14px;transition:color .2s;font-family:'Raleway',sans-serif;}
        .su-back:hover{color:#DAA520;}

        .su-success{position:fixed;inset:0;z-index:9998;background:rgba(13,10,8,.92);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
        .su-sc{text-align:center;padding:60px 56px;border:1px solid rgba(184,134,11,.3);border-radius:4px;background:#110D09;max-width:420px;animation:success-pop .5s cubic-bezier(.34,1.56,.64,1) forwards;}
        .su-pb{height:3px;border-radius:2px;background:rgba(184,134,11,.15);overflow:hidden;margin-top:24px;}
        .su-pf{height:100%;background:linear-gradient(90deg,#B8860B,#DAA520);animation:progress 2.2s linear forwards;}

        @media(max-width:900px){.su-left{display:none;}.su-right{padding:40px 24px;}.su-row2{grid-template-columns:1fr;}}
      `}</style>

      {success && (
        <div className="su-success">
          <div className="su-sc">
            <div style={{ fontSize:"3.5rem", marginBottom:"20px" }}>✅</div>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"1.7rem", color:"#F5F0E8", marginBottom:"14px" }}>Account Created!</h2>
            <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"1.05rem", color:"#8B7355", lineHeight:1.75, fontStyle:"italic" }}>
              Welcome to Bibliotheca. Redirecting you to sign in…
            </p>
            <div className="su-pb"><div className="su-pf" /></div>
          </div>
        </div>
      )}

      <div className="grain-ol" />

      <div className="su-page">

        {/* ══ LEFT ══ */}
        <div className="su-left">
          <button className="su-brand" onClick={() => navigate("/")}>
            <div className="su-brand-icon">📚</div>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"1.15rem" }} className="gold-sh">BIBLIOTHECA</div>
              <div style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.58rem", letterSpacing:"0.22em", color:"#8B7355", textTransform:"uppercase", marginTop:"-2px" }}>Library Management</div>
            </div>
          </button>

          <div className="su-lb">
            <div className="su-eyebrow">New Member</div>
            <h1 className="su-lt">Begin Your<br />Literary<br /><span className="gold-sh">Journey</span></h1>
            <p className="su-ld">Join thousands of readers who have made Bibliotheca their scholarly home. Free. Forever.</p>
          </div>

          <div className="su-perks">
            {[
              { icon:"📚", text:"Access 50,000+ books instantly" },
              { icon:"🔖", text:"Personalised reading lists & bookmarks" },
              { icon:"⚡", text:"Reserve books in seconds, anywhere" },
              { icon:"🤝", text:"Join community clubs & author events" },
            ].map((p,i) => (
              <div className="su-perk" key={i}>
                <span style={{ fontSize:"1.05rem", flexShrink:0 }}>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="su-right">
          <div className="su-fw">
            <div className="su-ft">
              <h2 className="su-title">Create Account</h2>
              <p className="su-sub">Fill in your details to get started — it's completely free</p>
            </div>

            <div className="su-row2">
              <div className="su-field">
                <label className="su-label">Full Name</label>
                <input className="su-input" placeholder="Jane Austen" value={form.name} onChange={set("name")} onKeyDown={handleKey} />
              </div>
              <div className="su-field">
                <label className="su-label">Roll Number</label>
                <input className="su-input" placeholder="2024CS001" value={form.rollNo} onChange={set("rollNo")} onKeyDown={handleKey} />
              </div>
            </div>

            <div className="su-field">
              <label className="su-label">Email Address</label>
              <input className="su-input" type="email" placeholder="jane@university.edu" value={form.email} onChange={set("email")} onKeyDown={handleKey} />
            </div>

            <div className="su-div"><div className="su-div-line"/><span className="su-div-txt">Security</span><div className="su-div-line"/></div>

            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-iw">
                <input className="su-input" type={showPass?"text":"password"} placeholder="At least 6 characters" value={form.password} onChange={set("password")} onKeyDown={handleKey} style={{ paddingRight:"46px" }} />
                <button className="su-eye" onClick={() => setShowPass(!showPass)}>{showPass?"🙈":"👁️"}</button>
              </div>
            </div>

            <div className="su-field">
              <label className="su-label">Confirm Password</label>
              <div className="su-iw">
                <input className="su-input" type={showConfirm?"text":"password"} placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} onKeyDown={handleKey} style={{ paddingRight:"46px" }} />
                <button className="su-eye" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm?"🙈":"👁️"}</button>
              </div>
            </div>

            <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:"0.74rem", color:"#8B7355", lineHeight:1.6, marginBottom:"6px" }}>
              By creating an account you agree to our{" "}
              <span style={{ color:"#B8860B", cursor:"pointer", textDecoration:"underline", textUnderlineOffset:"2px" }}>Terms of Service</span>
              {" "}and{" "}
              <span style={{ color:"#B8860B", cursor:"pointer", textDecoration:"underline", textUnderlineOffset:"2px" }}>Privacy Policy</span>.
            </p>

            <button className="su-btn" onClick={submit} disabled={loading}>
              {loading ? "Creating Account…" : "Create Free Account →"}
            </button>

            {error && (
              <div className="su-err">
                <span style={{ flexShrink:0, fontSize:"1rem" }}>⚠️</span>
                {error}
              </div>
            )}

            {/* ── Already have an account? → opens LoginSelector ── */}
            <div className="su-have">
              Already have an account?{" "}
              <button className="su-signin" onClick={() => navigate("/login")}>
                Sign in here
              </button>
            </div>

            <div style={{ textAlign:"center" }}>
              <button className="su-back" onClick={() => navigate("/")}>← Back to homepage</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
