import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw } from 'lucide-react';

const SUGGESTIONS = [
  'How do I write a strong resume?',
  'What are the top countries for studying abroad?',
  'How can I find scholarships for international students?',
  'What skills are in demand for software engineering jobs?',
  'How do I prepare for a job interview?',
  'What is the difference between MBA and MiM programs?',
];

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-blue-600' : 'bg-indigo-600'}`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white rounded-tr-sm'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 rounded-tl-sm'
      }`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

const AIAdvisorPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI Career Advisor powered by Gemini AI. I can help you with career guidance, job search strategies, study abroad options, scholarships, and more. What would you like to know? 🚀",
      timestamp: Date.now(),
      isGreeting: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    const userMessage = { role: 'user', text: userMsg, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Build history (exclude greeting messages from history)
      const history = messages
        .filter(m => !m.isGreeting)
        .map(m => ({ role: m.role, text: m.text }));

      const res = await aiAPI.getCareerAdvice({ message: userMsg, history });
      const reply = res.data.data.reply;
      setMessages(prev => [...prev, { role: 'assistant', text: reply, timestamp: Date.now() }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get AI response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', text: errMsg, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      text: "Hi! I'm your AI Career Advisor powered by Gemini AI. I can help you with career guidance, job search strategies, study abroad options, scholarships, and more. What would you like to know? 🚀",
      timestamp: Date.now(),
      isGreeting: true,
    }]);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Career Advisor</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Google Gemini AI</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <RotateCcw size={15} /> New Chat
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-gray-400 mb-2 font-medium">SUGGESTED QUESTIONS</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t dark:border-gray-800 p-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about careers, study abroad, scholarships..."
                rows={2}
                className="flex-1 px-4 py-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '💼', title: 'Career Guidance', desc: 'Get personalized career path advice and job search strategies' },
            { icon: '🎓', title: 'Study Abroad', desc: 'Find the best universities, programs, and scholarships worldwide' },
            { icon: '📄', title: 'Resume & Interviews', desc: 'Tips to craft a standout resume and ace your interviews' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAdvisorPage;
