import { useState } from "react";
import { FaRightFromBracket, FaAnglesLeft, FaAnglesRight, FaTrash, FaTrashCan } from "react-icons/fa6";

export default function Sidebar({
  sessions,
  activeSession,
  loadSession,
  logout,
  username,
  collapsed,
  toggleSidebar,
  onDeleteSession,   // (sessionId) => void — remove a single chat from history
  onClearHistory,    // () => void — wipe all history
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const safeUsername = username && username.length > 0 ? username : "Guest";
  const initial = safeUsername.charAt(0).toUpperCase();
  const safeSessions = sessions || [];

  const handleDelete = (e, sessionId) => {
    e.stopPropagation(); // don't trigger loadSession
    onDeleteSession?.(sessionId);
  };

  const handleClearAll = () => {
    if (safeSessions.length === 0) return;
    if (window.confirm("Clear all chat history? This can't be undone.")) {
      onClearHistory?.();
    }
  };

  if (collapsed) {
    // ── Collapsed rail — icons only, history hidden for space ──
    return (
      <div className="h-full flex flex-col items-center p-3">
        <button
          onClick={toggleSidebar}
          title="Expand sidebar"
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors hover:border-[var(--accent)]"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface2)' }}
        >
          <FaAnglesRight className="text-xs" />
        </button>

        <button
          onClick={logout}
          title="Log out"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface2)' }}
        >
          <FaRightFromBracket className="text-xs" />
        </button>

        <div className="flex-1" />

        <div
          title={safeUsername}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {initial}
        </div>
      </div>
    );
  }

  // ── Expanded sidebar — toggle/logout, history list, username ──
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleSidebar}
          title="Collapse sidebar"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:border-[var(--accent)]"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface2)' }}
        >
          <FaAnglesLeft className="text-xs" />
        </button>

        <button
          onClick={logout}
          title="Log out"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface2)' }}
        >
          <FaRightFromBracket className="text-xs" />
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          History
        </span>
        {safeSessions.length > 0 && (
          <button
            onClick={handleClearAll}
            title="Clear all history"
            className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[var(--red)]"
            style={{ color: 'var(--muted)' }}
          >
            <FaTrashCan className="text-[10px]" /> Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2">
        {safeSessions.length === 0 && (
          <div className="mt-8 text-center px-2">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No history yet</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--muted)', opacity: 0.7 }}>Your chats will show up here</p>
          </div>
        )}
        {safeSessions.map((s) => {
          const isActive = activeSession === s.session_id;
          return (
            <div
              key={s.session_id}
              onClick={() => loadSession?.(s.session_id)}
              onMouseEnter={() => setHoveredId(s.session_id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center gap-2 pl-3 pr-2 py-3 mb-1 rounded-lg cursor-pointer text-sm transition-colors"
              style={{
                background: isActive ? 'var(--surface2)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent2)' : '3px solid transparent',
                color: isActive ? 'var(--text)' : 'var(--muted)'
              }}
            >
              <span className="flex-1 block truncate font-medium">{s.preview}...</span>
              {(hoveredId === s.session_id || isActive) && (
                <button
                  onClick={(e) => handleDelete(e, s.session_id)}
                  title="Delete this chat"
                  className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg)] hover:text-[var(--red)] flex-shrink-0"
                  style={{ color: 'var(--muted)' }}
                >
                  <FaTrash className="text-[11px]" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Username */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {initial}
          </div>
          <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text)' }} title={safeUsername}>
            {safeUsername}
          </span>
        </div>
      </div>
    </div>
  );
}