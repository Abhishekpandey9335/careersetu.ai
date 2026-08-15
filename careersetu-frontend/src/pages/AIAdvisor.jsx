/**
 * AIAdvisor — calls the backend /api/ai/* endpoints (which internally call Grok/OpenAI).
 * No API keys in frontend. Requires login for AI calls (backend is secured).
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Sparkles, Bot, User, Download, RefreshCw, ChevronRight, LogIn, Paperclip } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/services';
import './AIAdvisor.css';

const samplePrompts = [
  'Best govt exams for BSc Computer Science graduate?',
  'TCS vs Infosys salary comparison for freshers',
  'Generate 3-month SSC CGL preparation plan',
  'What skills do I need for a Data Analyst job?',
  'Which stream is better after 10th for IAS?',
  'How to crack UPSC in first attempt?',
];

const quickActions = [
  { icon: '🗺️', label: 'Generate Roadmap',   apiCall: (msg) => aiService.generateRoadmap({ goal: msg }) },
  { icon: '💰', label: 'Salary Predictor',    prompt: 'Predict my salary growth in next 3 years' },
  { icon: '🎯', label: 'Career Guidance',     apiCall: () => aiService.careerGuidance() },
  { icon: '🔍', label: 'Skill Gap Analysis',  prompt: 'Analyze my skill gaps for my target job' },
  { icon: '🏢', label: 'College Predictor',   prompt: 'Which college should I target based on my profile?' },
  { icon: '🎤', label: 'Interview Coach',     apiCall: (msg) => aiService.interviewCoach({ role: msg, question: '', userAnswer: '' }) },
];

// Simple markdown renderer
const renderText = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^• /gm, '&bull; ')
    .replace(/\n/g, '<br/>');

export default function AIAdvisor() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `👋 **Hello! I'm CareerSetu's AI Career Advisor.**\n\nI can help you with:\n• 🏛️ Government exam guidance (SSC, UPSC, Banking, Railway)\n• 💼 Private sector career advice\n• 🗺️ Personalized study roadmaps\n• 🔍 Skill gap analysis\n• 💰 Salary predictions\n• 🎤 Interview preparation\n\n**Tell me about yourself** — your qualification, stream, and career goal — and I'll give you personalized guidance!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const payload = {
        message: msg,
        ...(conversationId && { conversationId }),
      };
      const res = await aiService.chat(payload);
      const aiData = res.data;                   // AiChatResponse
      if (aiData.conversationId) setConversationId(aiData.conversationId);
      setMessages((prev) => [...prev, { role: 'ai', text: aiData.reply || aiData.message || '' }]);
    } catch (err) {
      const isLimit = err.message?.toLowerCase().includes('limit') ||
                      err.message?.toLowerCase().includes('quota');
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: isLimit
            ? '⚠️ You have reached your daily AI query limit. **Upgrade to Premium** for unlimited queries!'
            : `Sorry, something went wrong: ${err.message}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isLoggedIn) { navigate('/login'); return; }

    setResumeUploading(true);
    setMessages((prev) => [...prev, { role: 'user', text: `Uploaded resume: ${file.name}` }]);
    try {
      const res = await aiService.uploadResume(file);
      const aiData = res.data;
      setMessages((prev) => [...prev, { role: 'ai', text: aiData.reply || aiData.message || 'Resume analyzed successfully!' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', text: `Sorry, resume upload failed: ${err.message}` }]);
    } finally {
      setResumeUploading(false);
      e.target.value = '';
    }
  };

  const handleQuickAction = async (qa) => {
    if (!isLoggedIn) { navigate('/login'); return; }

    if (qa.prompt) {
      sendMessage(qa.prompt);
      return;
    }

    // Actions with dedicated endpoints
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text: qa.label }]);
    try {
      const res = await qa.apiCall(qa.label);
      const aiData = res.data;
      setMessages((prev) => [...prev, { role: 'ai', text: aiData.reply || aiData.message || '' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setConversationId(null);
    setMessages([{
      role: 'ai',
      text: `👋 Chat cleared! I'm ready to help you again. What would you like to know about your career?`,
    }]);
  };

  return (
    <div className="ai-advisor-page">
      {/* Header */}
      <div className="ai-advisor-header">
        <div className="container">
          <div className="aah-content">
            <div className="aah-left">
              <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link>
                <ChevronRight size={12} /> <span>AI Career Advisor</span>
              </div>
              <h1 className="aah-title">
                <Sparkles size={24} /> AI Career Advisor
                <span className="badge badge-purple" style={{ marginLeft: 10, fontSize: 11 }}>
                  Powered by AI
                </span>
              </h1>
              <p className="aah-sub">
                Get personalized career guidance. Ask anything about exams, jobs, roadmaps, and more.
              </p>
            </div>
            <div className="aah-stats">
              <div className="aah-stat"><div className="aah-stat-num">2M+</div><div className="aah-stat-label">Questions Answered</div></div>
              <div className="aah-stat"><div className="aah-stat-num">98%</div><div className="aah-stat-label">Satisfaction Rate</div></div>
              <div className="aah-stat"><div className="aah-stat-num">24/7</div><div className="aah-stat-label">Available</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 20px' }}>
        <div className="ai-advisor-grid">
          {/* Chat area */}
          <div className="chat-container card">
            <div className="chat-toolbar">
              <div className="chat-toolbar-left">
                <Bot size={18} style={{ color: 'var(--purple)' }} />
                <span className="chat-title">CareerSetu AI</span>
                <span className="online-dot"></span>
                <span style={{ fontSize: 12, color: 'var(--secondary)' }}>Online</span>
              </div>
              <div className="chat-toolbar-right">
                <button className="icon-btn" title="Clear chat" onClick={clearChat}><RefreshCw size={15} /></button>
                <button className="icon-btn" title="Download conversation"><Download size={15} /></button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  <div className="chat-avatar">
                    {msg.role === 'ai'
                      ? <div className="ai-avatar-icon"><Bot size={16} /></div>
                      : <div className="user-avatar-icon"><User size={16} /></div>}
                  </div>
                  <div className="chat-bubble">
                    <div
                      className="chat-bubble-text"
                      dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                    />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message ai">
                  <div className="chat-avatar"><div className="ai-avatar-icon"><Bot size={16} /></div></div>
                  <div className="chat-bubble">
                    <div className="typing-indicator"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sample prompts */}
            {messages.length <= 2 && (
              <div className="sample-prompts">
                <div className="sample-prompts-title">Try asking:</div>
                <div className="sample-prompts-grid">
                  {samplePrompts.map((p) => (
                    <button key={p} className="sample-prompt-btn" onClick={() => sendMessage(p)}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login prompt if not logged in */}
            {!isLoggedIn && (
              <div className="chat-login-prompt">
                <LogIn size={16} />
                <span>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>login</Link> to chat with the AI advisor</span>
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <div className="chat-input-wrap">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                  }}
                  placeholder={
                    isLoggedIn
                      ? 'Ask anything about your career, exams, jobs...'
                      : 'Login to start chatting...'
                  }
                  className="chat-textarea"
                  rows={2}
                  disabled={!isLoggedIn}
                />
                <div className="chat-input-actions">
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                  <button className="icon-btn" type="button" title="Upload resume" onClick={() => fileInputRef.current.click()} disabled={resumeUploading || !isLoggedIn}>
                    <Paperclip size={16} />
                  </button>
                  <button
                    className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading || !isLoggedIn}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="chat-disclaimer">
                AI responses are for guidance only. Always verify from official sources.
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="ai-right-panel">
            <div className="sidebar-widget card-flat">
              <h3 className="sw-title">⚡ Quick Actions</h3>
              <div className="quick-actions-list">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(qa)}
                  >
                    <span className="qa-icon">{qa.icon}</span>
                    <span className="qa-label">{qa.label}</span>
                    <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </button>
                ))}
              </div>
            </div>

            {!isLoggedIn && (
              <div className="premium-sidebar card" style={{ marginTop: 16 }}>
                <div className="premium-crown">🔐</div>
                <h3>Login Required</h3>
                <p>Login to start chatting with the AI advisor</p>
                <Link to="/login" className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center', marginTop: 10 }}>
                  Login / Register Free
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="premium-sidebar card" style={{ marginTop: 16 }}>
                <div className="premium-crown">👑</div>
                <h3>Go Premium</h3>
                <p>Unlimited AI queries + save conversations</p>
                <Link to="/premium" className="btn btn-accent btn-sm w-full" style={{ justifyContent: 'center', marginTop: 10 }}>
                  Upgrade — ₹99/mo
                </Link>
              </div>
            )}

            <div className="sidebar-widget card-flat" style={{ marginTop: 16 }}>
              <h3 className="sw-title">💡 Pro Tips</h3>
              {[
                'Mention your qualification for tailored advice',
                'Ask for step-by-step study plans',
                'Compare exams to find the best fit',
                'Ask for salary predictions by location',
              ].map((tip, i) => (
                <div key={i} className="tip-item">
                  <span className="tip-num">{i + 1}</span>
                  <span className="tip-text">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
