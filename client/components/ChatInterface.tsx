import { useState } from "react";
import { sendToN8nWorkflow } from "../lib/n8nService";

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  agentName?: string;
  agentDescription?: string;
  context?: string;
}

export function ChatInterface({ 
  agentName = "Seth agent", 
  agentDescription = "Business Setup Assistant",
  context = "business_setup" 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: '👋 Hey, I\'m Seth, your AI assistant! I\'m here to help you set up your business details. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use n8nService like previous design
      const sessionId = `${context}_${Date.now()}`;
      const result = await sendToN8nWorkflow(
        'Seth',
        inputMessage,
        sessionId,
        {
          type: 'user_message',
          context: context
        }
      );

      console.log('N8N Service result:', result);
      
      // Only add bot message if N8N returns a response
      if (result && (result.response || result.message || result.reply)) {
        const botContent = result.response || result.message || result.reply;
        const botMessage: Message = {
          type: 'bot',
          content: botContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('N8N service error:', error);
      const errorMessage: Message = {
        type: 'bot',
        content: 'I\'m having trouble connecting right now. Please continue with the setup form, and I\'ll be back to help soon!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-96 bg-white border border-grey-700 rounded-modal h-[793px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-grey-700">
        <h3 className="text-2xl font-semibold text-text-primary text-center">Set up your AI agent</h3>
      </div>

      {/* Agent Header */}
      <div className="p-4 border-b border-grey-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
            <span className="text-white font-semibold">☀️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">{agentName}</h4>
            <p className="text-text-subtle text-sm">{agentDescription}</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.49969 15.0003L11.1515 8.34853C11.4485 8.05152 11.597 7.90301 11.7682 7.84737C11.9189 7.79842 12.0811 7.79842 12.2318 7.84737C12.403 7.90301 12.5515 8.05152 12.8485 8.34853L16.0539 11.5539M7.875 6.375C7.875 7.20343 7.20343 7.875 6.375 7.875C5.54657 7.875 4.875 7.20343 4.875 6.375C4.875 5.54657 5.54657 4.875 6.375 4.875C7.20343 4.875 7.875 5.54657 7.875 6.375ZM16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6.69853C16.5 6.24417 16.5 6.01699 16.4102 5.91179C16.3322 5.82051 16.2152 5.77207 16.0956 5.78149C15.9577 5.79234 15.797 5.95298 15.4757 6.27426L12.75 9L15.4757 11.7257C15.797 12.047 15.9577 12.2077 16.0956 12.2185C16.2152 12.2279 16.3322 12.1795 16.4102 12.0882C16.5 11.983 16.5 11.7558 16.5 11.3015V6.69853ZM1.5 7.35C1.5 6.08988 1.5 5.45982 1.74524 4.97852C1.96095 4.55516 2.30516 4.21095 2.72852 3.99524C3.20982 3.75 3.83988 3.75 5.1 3.75H9.15C10.4101 3.75 11.0402 3.75 11.5215 3.99524C11.9448 4.21095 12.289 4.55516 12.5048 4.97852C12.75 5.45982 12.75 6.08988 12.75 7.35V10.65C12.75 11.9101 12.75 12.5402 12.5048 13.0215C12.289 13.4448 11.9448 13.789 11.5215 14.0048C11.0402 14.25 10.4101 14.25 9.15 14.25H5.1C3.83988 14.25 3.20982 14.25 2.72852 14.0048C2.30516 13.789 1.96095 13.4448 1.74524 13.0215C1.5 12.5402 1.5 11.9101 1.5 10.65V7.35Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`${
              message.type === 'user' ? 'ml-8 flex flex-col items-end' : 'mr-8'
            }`}>
              <div className={`${
                message.type === 'user' 
                  ? 'bg-gray-100 rounded-xl p-3 max-w-[80%]' 
                  : 'bg-gray-50 rounded-lg p-3'
              }`}>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
              </div>
              <p className={`text-text-subtle text-xs mt-1 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-grey-700">
        <div className="flex items-center gap-2 border border-grey-500 rounded-xl p-2">
          <input 
            type="text"
            placeholder="Your message..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-subtle text-sm"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 rounded-lg bg-squidgy-purple hover:bg-squidgy-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 16 16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.25 5.75L5.75 12.25M12.25 5.75L8.5 5.75M12.25 5.75L12.25 9.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
