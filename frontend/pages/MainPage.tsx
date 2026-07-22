import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function MainPage({ chatState, authState }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const sidebarWidth = sidebarCollapsed ? 64 : 260;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Only width/min-width are animated here — a pure left-right resize.
          ChatWindow is flex-1 so it reflows into the freed space automatically. */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          minWidth: `${sidebarWidth}px`,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--surface)',
          transition: 'width 0.2s ease, min-width 0.2s ease',
          overflow: 'hidden',
        }}
      >
        <Sidebar
          sessions={chatState.sessions}
          activeSession={chatState.activeSession}
          loadSession={chatState.loadSession}
          logout={authState.logout}
          username={authState.username}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          onDeleteSession={chatState.onDeleteSession}
          onClearHistory={chatState.onClearHistory}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <ChatWindow
          messages={chatState.messages}
          input={chatState.input}
          loading={chatState.loading}
          chatEndRef={chatState.chatEndRef}
          setInput={chatState.setInput}
          sendMessage={chatState.sendMessage}
          createNewSession={chatState.createNewSession}
          regenerateResponse={chatState.regenerateResponse}
          activeSession={chatState.activeSession}
        />
      </div>
    </div>
  );
}
