import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const suggestedPrompts = [
  "What is the beaching risk at Versova?",
  "How does the Hungarian fleet optimizer work?",
  "Explain the Monte Carlo hydrodynamic drift."
];

export const OceanGPTWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Welcome to TIDAL Tactical Command. I'm Ocean-GPT, your maritime intelligence copilot. Ask me anything about current coastal risk tiers, hydrodynamic simulations, or autonomous fleet dispatch." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/chat', { message: textToSend });
      const newBotMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: res.data.response };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error('Error sending message to Ocean-GPT:', error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: "Direct data link offline. Tactical fallback response: Active hotspot is Versova Creek (Zone A) with 420 kg predicted accumulation. 3 Autonomous Skimmers stand ready for deployment." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[420px] h-[540px] max-h-[82vh] flex flex-col bg-surface-container-low/95 backdrop-blur-2xl border border-primary/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right">
          
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-4 px-5 border-b border-outline-variant/30 bg-surface-container/60">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center shadow-glow-sm">
                <div className="w-full h-full rounded-[14px] bg-surface flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-surface"></span>
              </div>
              <div>
                <h3 className="text-on-surface font-headline font-bold text-sm flex items-center gap-1.5">
                  Ocean-GPT
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">AGENT</span>
                </h3>
                <p className="text-on-surface-variant text-[11px] font-mono">Marine Copilot • LLM Function Calling</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30"
              aria-label="Close Ocean-GPT"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 max-w-[88%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser 
                      ? 'bg-primary text-on-primary font-mono' 
                      : 'bg-surface-container-high text-primary border border-primary/20'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div 
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser 
                        ? 'bg-primary text-on-primary font-medium rounded-tr-xs shadow-sm' 
                        : 'bg-surface-container/90 text-on-surface border border-outline-variant/40 rounded-tl-xs shadow-sm font-mono'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 self-start max-w-[85%]">
                <div className="w-7 h-7 rounded-xl bg-surface-container-high text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container/90 border border-outline-variant/40 rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  <span className="text-[11px] font-mono text-on-surface-variant ml-1.5">Analyzing ocean state...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (when only 1 or 2 messages) */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-on-surface-variant/70 tracking-wider">Suggested queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container/70 hover:bg-surface-container hover:text-primary text-[10px] font-mono text-on-surface-variant border border-outline-variant/30 text-left transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-3.5 border-t border-outline-variant/30 bg-surface-container/40">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about hotspots, debris drift, fleet..."
                className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-xs font-mono"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-center hover:shadow-glow transition-all disabled:opacity-40 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl group ${
          isOpen 
            ? 'bg-surface-container-highest text-on-surface rotate-90 scale-95 border border-outline-variant/50' 
            : 'bg-gradient-to-tr from-primary to-secondary text-on-primary shadow-glow hover:scale-105'
        }`}
        aria-label="Open Ocean-GPT Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-on-primary group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default OceanGPTWidget;
