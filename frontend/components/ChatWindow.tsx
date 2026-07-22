import { useRef, useEffect, useState, Fragment } from "react";
import axios from "axios";
import { 
  FaArrowUp, FaRobot, FaCreditCard, FaScrewdriverWrench, FaHeadset, FaPlus, 
  FaMoneyBillWave, FaFlag, FaBook, FaTruckFast, FaShieldHalved ,FaMicrophone, FaMicrophoneSlash,FaEnvelope
} from "react-icons/fa6";
import MessageBubble from "./MessageBubble";
import "../styles/typewriter.css";
import api,{chatAPI} from "../services/api";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
export default function ChatWindow({ messages, input, loading, chatEndRef, setInput, sendMessage, createNewSession, regenerateResponse,activeSession }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const recognitionRef = useRef<any>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState("");
  const toggleVoice = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    let errored = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      if (!errored) {
        setIsListening(false);
      }
      recognitionRef.current = null;
    };
    
    recognition.onerror = (event) => {
      errored = true;
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone permissions in your browser settings and ensure you are running the app on HTTP/HTTPS (not file://).");
      } else {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };
  const quickReplies = [
    { label: "Pricing plans", icon: FaCreditCard, text: "What are your pricing plans?" },
    { label: "Technical issue", icon: FaScrewdriverWrench, text: "I have a technical issue" },
    { label: "Request a refund", icon: FaMoneyBillWave, text: "I want to know about refund" },
    { label: "Complaint", icon: FaFlag, text: "I want to know how to make complaint" },
    { label: "Product Manual", icon: FaBook, text: "I want to know about  product user manual" },
    { label: "Shipping info", icon: FaTruckFast, text: "I want to know about Shipping and Delivery" },
    { label: "Warranty info", icon: FaShieldHalved, text: "I want to know about Warranty" },
    { label: "Talk to an agent", icon: FaHeadset, text: "Talk to an technical support agent" },
  ];
  const handleEmailSummary = async () => {
  setEmailStatus("Sending...");
  try {
    const res = await api.post('/chat/email-summary', { session_id: activeSession });
    setEmailStatus("✅ " + res.data.message);
    setTimeout(() => setEmailStatus(""), 3000); // Hide after 3s
  } catch (err) {
    setEmailStatus("❌ Failed to send.");
    setTimeout(() => setEmailStatus(""), 3000);
  }
  };
  // Auto-grow the textarea as the user types, up to a max height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 260; // px
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }, [input]);


  const sendQuickReply = (text) => {
    if (loading) return;
    setInput(text);
    handleSendMessage(text);
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText ?? input;
    if (loading || !textToSend.trim()) return;
    try {
      await sendMessage(textToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please check your connection and try again.");
    }
  };
  const handleRegenerate = async () => {
    if (loading) return;
    try {
      await regenerateResponse();
    } catch (error) {
      console.error("Failed to regenerate response:", error);
      alert("Failed to regenerate response. Please check your connection and try again.");
    }
  };
  const submitFeedback = async (rating: "good" | "bad") => {
    if (!activeSession) {
      // This is the root cause of the 422: session_id is missing entirely,
      // so it's dropped from the JSON body and FastAPI rejects the request.
      console.error("Cannot submit feedback: activeSession is", activeSession);
      alert("Can't submit feedback yet — no active session. Try sending a message first.");
      return;
    }
    setFeedback(rating);
    try {
      await api.post("/chat/feedback", { session_id: activeSession, rating });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setFeedback(null); // let them retry
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header — console status bar */}
      <div className="px-8 py-5 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent)' }}
          >
          </div>
          <div className="min-w-0">
            <h1 className="font-['var(--font-syne)] text-xl font-bold tracking-tight truncate" style={{ color: 'var(--text)' }}>
              TechMart - 🤖 AI Support Agent
            </h1>
            <p className="text-[12px] mt-0.5 tracking-wide" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              MULTI-AGENT SYSTEM(10 AGENTS ONLINE)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--green)' }} />
            <span className="text-[11px] font-medium tracking-wide" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              
            </span>
          </div>

          {createNewSession && (
            <button
              onClick={createNewSession}
              title="New chat"
              className="flex items-center gap-2 text-white px-3.5 py-2 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--accent), #5d4fe0)' }}
            >
              <FaPlus className="text-[11px]" />
              <span className="hidden md:inline">New chat</span>
            </button>
          )}
        </div>
      </div>
      <div className="signal-rail" />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollbarGutter: 'stable' }}>
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-14 text-center animate-fade-up">
            <div className="relative inline-block mb-6">
              <div className="absolute w-4 h-4 -top-1.5 -left-1.5 border-t-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
              <div className="absolute w-4 h-4 -top-1.5 -right-1.5 border-t-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
              <div className="absolute w-4 h-4 -bottom-1.5 -left-1.5 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
              <div className="absolute w-4 h-4 -bottom-1.5 -right-1.5 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
              <div
                className="w-16 h-16 flex items-center justify-center text-2xl"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent)' }}
              >
                <FaRobot />
              </div>
            </div>

            <h2 className="font-['var(--font-syne)] text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Welcome to TechMart Support
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              I'm your multi-agent assistant. Ask me about billing, tech support, products, or file a complaint — I'll route you to the right specialist.
              <br />
              Quick replies are available below (double click it to get started):
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
              {quickReplies.map((qr, i) => {
                const Icon = qr.icon;
                return (
                  <button
                    key={i}
                    onClick={() => sendQuickReply(qr.text)}
                    className="flex items-center gap-3 text-left text-[15px] font-semibold px-5 py-4 rounded-[12px] transition-colors"
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <Icon className="text-lg flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    {qr.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-1">
            {messages.map((msg, idx) => (
              <Fragment key={idx}>
                <MessageBubble msg={msg} />
                {msg.agents?.includes("human_agent") && (
                  <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm flex items-center gap-3">
                    <span className="animate-pulse">🟡</span> Session handed off to a human agent. AI is paused.
                  </div>
                )}
              </Fragment>
            ))}
            
            {loading && (
              <div className="flex items-end gap-2.5 mt-4 animate-fade-up">
                <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#171100' }}>
                  <FaRobot />
                </div>
                <div className="px-5 py-4" style={{ background: 'var(--surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border)', borderLeftWidth: '2px', borderLeftStyle: 'solid', borderLeftColor: 'var(--accent2)', borderRadius: '3px var(--radius) var(--radius) var(--radius)' }}>
                  <div className="typing-dots flex gap-1.5">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Persistent quick-reply rail */}
      {messages.length > 0 && (
        <div className="px-4 pt-3">
          <div className="w-full flex items-center gap-2.5 overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'thin' }}>
            {quickReplies.map((qr, i) => {
              const Icon = qr.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendQuickReply(qr.text)}
                  disabled={loading}
                  className="flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-40 flex-shrink-0"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
                >
                  <Icon className="text-sm flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  {qr.label}
                </button>
                
              );
            })}
          </div>
        </div>
      )}
      
      {/* --- ADDED REGENERATE BUTTON HERE --- */}
      {messages.length > 0 && !loading && (
        <div className="flex justify-center pb-2 pt-1">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-full transition-all duration-200"
            style={{ 
              background: 'var(--surface2)', 
              border: '1px solid var(--border)', 
              color: 'var(--muted)' 
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.borderColor = 'var(--accent)'; 
              e.currentTarget.style.color = 'var(--text)'; 
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.borderColor = 'var(--border)'; 
              e.currentTarget.style.color = 'var(--muted)'; 
            }}
          >
            🔄 Regenerate response
          </button>
          {/* NEW EMAIL BUTTON */}
          <button onClick={handleEmailSummary} disabled={emailStatus.includes("Sending")}
            className="flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
            <FaEnvelope className="text-[10px]" /> {emailStatus || "Email Summary"}
         </button>
        </div>
      )}
      {messages.length > 0 && !feedback && !loading && (
        <div className="flex justify-center gap-4 pb-3">
         <span className="text-xs text-gray-500 self-center">Was this helpful?</span>
         <button onClick={() => submitFeedback('good')}
            className="text-2xl hover:scale-125 transition-transform">👍</button>
         <button onClick={() => submitFeedback('bad')}
            className="text-2xl hover:scale-125 transition-transform">👎</button>
        </div>
      )}
    {feedback && <div className="text-center text-xs text-green-400 pb-2">Thanks for your feedback!</div>} 
      {/* Input Area */}
      <div className="px-4 pb-6 pt-3" style={{ background: 'var(--bg)' }}>
        <div
          className="console-input w-full flex items-end gap-3 p-2.5 rounded-2xl transition-all"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          
          <textarea
            ref={textareaRef}
            rows={3}
            className="flex-1 bg-transparent text-[15px] px-4 py-3 resize-none leading-relaxed"
            style={{ color: 'var(--text)', caretColor: 'var(--accent)', minHeight: '76px', maxHeight: '260px' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pricing, tech support, or say 'I want a refund'… (Shift+Enter for a new line)"
            disabled={loading}
          />
         <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 flex-shrink-0 mb-0.5 hover:brightness-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, var(--accent), #5d4fe0)' }}
          >
            <FaArrowUp className="text-sm" />
          </button>
          <button onClick={toggleVoice} className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0 mb-0.5"
            style={{ background: isListening ? 'var(--accent2)' : 'var(--surface2)', border: '1px solid var(--border)' }}>
            {isListening ? <FaMicrophoneSlash className="text-sm" /> : <FaMicrophone className="text-sm" />}
          </button>  
        </div>
        <p className="text-center text-[11px] mt-3 tracking-wide" style={{ color: 'var(--muted)' }}>
          TechMart Multi-Agent AI can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}