"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function MainPage({ chatState, authState }) {
  const {
    sessions,
    activeSession,
    messages,
    input,
    loading,
    chatEndRef,
    setInput,
    sendMessage,
    createNewSession,
    loadSession,
    onDeleteSession,
    onClearHistory,
    collapsed,
    toggleSidebar,
    regenerateResponse
  } = chatState;

  const { logout, username } = authState;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1719]">
      {/* Sidebar */}
      <div className={`border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'}`} 
           style={{ borderColor: '#2A3A3A', background: '#141E20' }}>
        <Sidebar 
          sessions={sessions}
          activeSession={activeSession}
          loadSession={loadSession}
          logout={logout}
          username={username}
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          onDeleteSession={onDeleteSession}
          onClearHistory={onClearHistory}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow 
          messages={messages}
          input={input}
          loading={loading}
          chatEndRef={chatEndRef}
          setInput={setInput}
          sendMessage={sendMessage}
          createNewSession={createNewSession}
          regenerateResponse={regenerateResponse}
          activeSession={activeSession}
        />
      </div>
    </div>
  );
}
