import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Sparkles, User, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialPrompt?: string;
  onSelectProduct: (product: Product) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  products,
  initialPrompt,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState(initialPrompt || '');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'سلام! من مشاور هوشمند خرید در فروشگاه آریا هستم 👋\nمی‌توانید درباره بودجه، مشخصات فنی، هدیه یا مقایسه کالاهای دیجیتال، پوشاک و خانه از من بپرسید تا بهترین پیشنهاد را به شما ارائه دهم.',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: textToSend }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'پاسخی دریافت نشد.';

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Error:', err);
      const errorMsg: Message = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'متأسفانه در حال حاضر در برقراری ارتباط با مشاور هوشمند مشکلی پیش آمده است. لطفاً لحظاتی دیگر تلاش کنید.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'با ۶۰ میلیون چه گوشی یا لپ‌تاپی بخرم؟',
    'بهترین هدفون نویزگیر چیه؟',
    'اسپرسوساز دلونگی چه ویژگی‌هایی داره؟',
    'پیشنهاد برای هدیه روز تولد با قیمت مناسب',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">مشاور هوشمند خریدار (Gemini AI)</h3>
              <p className="text-[10px] text-emerald-100">پاسخگویی زنده به سوالات و پیشنهاد بهترین کالاهای آریا</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 dark:bg-slate-700'
                    : 'bg-emerald-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white dark:bg-slate-800 rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-60 block text-left font-mono mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>مشاور هوشمند در حال تحلیل و پاسخگویی است...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Chips & Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          {/* Quick chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="shrink-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال خود را بپرسید (مثلاً: بهترین لپ‌تاپ تا ۸۰ میلیون تومان)..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
