import { useState, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";

export const useChat = (username) => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  // --- THE CRITICAL FIX ---
  // This runs every time the user logs in or out.
  // It wipes the screen completely before loading the new user's data.
  useEffect(() => {
    // 1. Hard reset all chat states
    setSessions([]);
    setMessages([]);
    setActiveSession("");
    setInput("");
    setLoading(false);

    // 2. If a user is actually logged in, fetch THEIR specific history
    if (username && localStorage.getItem("token")) {
      fetchSessions();
    }
  }, [username]); // Re-run this effect ONLY when the username changes

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // We remove the `if (!activeSession)` check here because we know 
  // activeSession is forcefully cleared to "" right before this runs.
  const fetchSessions = async () => {
    try {
      const res = await chatAPI.getHistory(username);
      setSessions(res.data);
      
      if (res.data.length > 0) {
        // Explicitly load the first session for the new user
        const firstSessionId = res.data[0].session_id;
        setActiveSession(firstSessionId);
        
        const sessionRes = await chatAPI.getSession(firstSessionId);
        setMessages(sessionRes.data);
      } else {
        // No history? Create a blank session for them
        createNewSession();
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      // IF THE TOKEN IS INVALID (401), AUTOMATICALLY LOG THE USER OUT
      if (err.response && err.response.status === 401) {
        console.log("Token expired or invalid. Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload(); // Refreshes the page, which triggers the login screen
      }
    }
  };

  const createNewSession = () => {
    const newId = `${username}_${Date.now()}`;
    setActiveSession(newId);
    setMessages([]);
  };

  const loadSession = async (sessionId) => {
    setActiveSession(sessionId);
    try {
      const res = await chatAPI.getSession(sessionId);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  const _processMessage = async (textToSend) => {
    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(textToSend, activeSession);
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: res.data.response, 
        agents: res.data.agents_used 
      }]);
      fetchSessions(); 
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: "⚠️ Request failed or AI timed out. Please try again.", 
        isError: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeSession || loading) return;
    const currentInput = input;
    setInput(""); 
    _processMessage(currentInput);
  };

  const regenerateResponse = () => {
    if (loading || messages.length === 0) return;
    
    let lastUserText = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserText = messages[i].content;
        break;
      }
    }

    if (!lastUserText) return;

    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].isError) {
        updated.pop();
      }
      return updated;
    });

    _processMessage(lastUserText);
  };

  const onDeleteSession = async (sessionId) => {
    try {
      await chatAPI.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      if (activeSession === sessionId) {
        setMessages([]);
        createNewSession(); 
      }
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const onClearHistory = async () => {
    try {
      await chatAPI.clearAllHistory(username);
      setSessions([]);
      setMessages([]);
      createNewSession();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  return { 
    sessions, activeSession, messages, input, loading, chatEndRef, 
    setInput, sendMessage, createNewSession, loadSession, 
    onDeleteSession, onClearHistory, collapsed, toggleSidebar,
    regenerateResponse 
  };
};