"use client";
import { useState } from "react";
import { FaHeadset,FaRobot } from "react-icons/fa6";

export default function AuthForm({ handleAuth, authError }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = (e) => {
    handleAuth(e, username, email, password, isRegister);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md relative animate-fade-up">

        {/* Corner brackets — console-frame signature */}
        <div className="absolute w-5 h-5 top-0 left-0 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
        <div className="absolute w-5 h-5 top-0 right-0 border-t-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
        <div className="absolute w-5 h-5 bottom-0 left-0 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
        <div className="absolute w-5 h-5 bottom-0 right-0 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />

        <div className="p-9 sm:p-11" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 pulse-dot" style={{ background: 'var(--green)' }} />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              TechMart Support · Access
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
              <FaRobot className="text-xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                {isRegister ? "Create account" : "Sign in"}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                {isRegister ? "Set up access to the support desk" : "Continue to your support session"}
              </p>
            </div>
          </div>

          {authError && (
            <div className="px-4 py-3 mb-6 text-sm flex items-center gap-2" style={{ background: 'rgba(226, 96, 79, 0.12)', border: '1px solid rgba(226, 96, 79, 0.35)', color: '#f0a89d' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--red)' }} />
              {authError}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-medium tracking-[0.1em] uppercase mb-2 block" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                Username:
              </label>
              <input
                type="text"
                placeholder="jane.doe"
                className="w-full text-[15px] px-4 py-3 transition-all duration-150 rounded-md"
                style={{ 
                  background: 'var(--surface2)', 
                  border: '1px solid var(--border)', 
                  color: 'var(--text)',
                  boxSizing: 'border-box', // Ensures padding doesn't affect total width
                  lineHeight: '1.5',       // Forces consistent height calculation
                  fontFamily: 'inherit',   // Prevents browser default fonts
                  outline: 'none'          // Removes default browser outlines
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(224,145,63,0.14)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            {isRegister && (
              <div>
                <label className="text-[11px] font-medium tracking-[0.1em] uppercase mb-2 block" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  Email Address:
                </label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full text-[15px] px-4 py-3 transition-all duration-150 rounded-md"
                  style={{ 
                    background: 'var(--surface2)', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text)',
                    boxSizing: 'border-box',
                    lineHeight: '1.5',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(224,145,63,0.14)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-medium tracking-[0.1em] uppercase mb-2 block" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                Password:
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-[15px] px-4 py-3 transition-all duration-150 rounded-md"
                style={{ 
                  background: 'var(--surface2)', 
                  border: '1px solid var(--border)', 
                  color: 'var(--text)',
                  boxSizing: 'border-box',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(224,145,63,0.14)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 font-semibold text-[15px] transition-all duration-150 mt-2 rounded-md active:scale-[0.99]"
              style={{ background: 'var(--accent)', color: '#171100' }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#eda45c')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'var(--accent)')}
            >
              {isRegister ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center" style={{ color: 'var(--muted)' }}>
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <span
              className="cursor-pointer font-semibold transition-colors"
              style={{ color: 'var(--accent2)' }}
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
