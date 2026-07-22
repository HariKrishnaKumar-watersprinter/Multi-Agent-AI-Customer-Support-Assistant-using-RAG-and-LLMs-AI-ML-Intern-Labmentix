@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Root variables — "service desk console" palette ── */
:root {
    --bg:            #0F1719;
    --surface:       #141E20;
    --surface2:      #1B2729;
    --surface3:      #223032;
    --border:        #2A3A3A;
    --border-strong: #3D5150;
    --accent:        #E0913F;   /* copper / solder amber */
    --accent2:       #5FB8AE;   /* teal — status ok / agent tags */
    --green:         #6FCF97;
    --amber:         #E0913F;
    --red:           #E2604F;
    --text:          #EDEEE9;
    --muted:         #7C8C89;
    --radius:        8px;

    /* Tells the browser this UI is dark, so native form-control rendering
       (input/textarea text & caret color, autofill, etc.) doesn't fall back
       to a light-mode default that can make typed text invisible. */
    color-scheme: dark;
}

/* ── Global reset ── */
body {
    background: var(--bg) !important;
    color: var(--text) !important;
    margin: 0;
    padding: 0;
    font-family: var(--font-body), sans-serif;
    /* faint diagnostic-grid texture */
    background-image:
      linear-gradient(rgba(237, 238, 233, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(237, 238, 233, 0.025) 1px, transparent 1px);
    background-size: 32px 32px;
}

/* Belt-and-braces: force visible typed text on every text input/textarea,
   regardless of any other stylesheet or browser default trying to set it. */
input, textarea {
  color: var(--text) !important;
  -webkit-text-fill-color: var(--text) !important;
  caret-color: var(--accent);
  background-color: transparent;
}
input::placeholder, textarea::placeholder { color: var(--muted); opacity: 0.65; }
::selection { background: rgba(224, 145, 63, 0.32); color: var(--text); }

/* Autofilled fields (e.g. saved username/password) keep the dark theme
   instead of the browser's default white autofill background. */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--surface2) inset !important;
  -webkit-text-fill-color: var(--text) !important;
  caret-color: var(--accent);
}

/* ── Animations ── */
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
    0%   { opacity: 0; transform: scale(0.96); }
    100% { opacity: 1; transform: scale(1); }
}
@keyframes slideRight {
    from { opacity: 0; transform: translateX(8px); }
    to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideLeft {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
}
@keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(111, 207, 151, 0.55); }
    70%  { box-shadow: 0 0 0 6px rgba(111, 207, 151, 0); }
    100% { box-shadow: 0 0 0 0 rgba(111, 207, 151, 0); }
}
@keyframes sweep {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(220%); }
}

.animate-fade-up { animation: fadeUp 0.3s ease forwards; }
.animate-pop-in { animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
.animate-slide-right { animation: slideRight 0.25s ease forwards; }
.animate-slide-left { animation: slideLeft 0.25s ease forwards; }

.pulse-dot { animation: pulseRing 2.2s ease-out infinite; }

/* Thin amber "signal" sweep — used as a hairline accent under headers */
.signal-rail { position: relative; overflow: hidden; height: 1px; background: var(--border); }
.signal-rail::after {
  content: '';
  position: absolute; top: 0; left: 0; height: 100%; width: 30%;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: sweep 4.5s linear infinite;
}

/* Glowing focus ring for the chat input row */
.console-input:focus-within {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px rgba(224, 145, 63, 0.14);
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-up, .animate-pop-in, .animate-slide-right, .animate-slide-left,
  .pulse-dot, .signal-rail::after {
    animation: none !important;
  }
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 9px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

input, textarea:focus { outline: none; }

*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}