import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage, clearChatSession } from '../lib/chatApi';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const WELCOME_MESSAGE = `Hello! 👋 I'm your financial advisor. I have access to your transaction history, account balances, and financial metrics.

You can ask me things like:
• Can I afford to buy furniture worth ₹4 lakh?
• Should I take a loan of ₹10 lakh?
• What's my current runway?
• How much am I spending on marketing?

How can I help you today?`;

// Format markdown-like syntax in responses
const formatMessageContent = (content: string): React.ReactNode => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
        // Bold text: **text**
        let formattedLine: React.ReactNode = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Check for bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return (
                <div key={index} className="flex gap-2 ml-2">
                    <span className="text-olive">•</span>
                    <span dangerouslySetInnerHTML={{ __html: formattedLine.toString().replace(/^[\s]*[•\-]\s*/, '') }} />
                </div>
            );
        }

        // Check for numbered lists
        const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
            return (
                <div key={index} className="flex gap-2 ml-2">
                    <span className="text-olive font-semibold">{numMatch[1]}.</span>
                    <span dangerouslySetInnerHTML={{ __html: numMatch[2] }} />
                </div>
            );
        }

        // Regular paragraph
        if (line.trim() === '') {
            return <div key={index} className="h-2" />;
        }
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine.toString() }} />;
    });
};

const DecisionPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initialize with welcome message
    useEffect(() => {
        setMessages([{
            id: 'assistant-welcome',
            role: 'assistant',
            content: WELCOME_MESSAGE,
            timestamp: new Date()
        }]);
    }, []);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [input]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || !user) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(user.id, userMessage.content, sessionId || undefined);
            setSessionId(response.session_id);

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: response.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: `assistant-error-${Date.now()}`,
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            textareaRef.current?.focus();
        }
    }, [input, isLoading, user, sessionId]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = async () => {
        if (sessionId && user) {
            try {
                await clearChatSession(user.id, sessionId);
            } catch (error) {
                console.error('Failed to clear session:', error);
            }
        }
        setSessionId(null);
        setMessages([{
            id: 'assistant-welcome',
            role: 'assistant',
            content: WELCOME_MESSAGE,
            timestamp: new Date()
        }]);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-row bg-background-light text-walnut font-display selection:bg-olive selection:text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-0 gap-4 overflow-hidden h-screen relative">
                {/* Header */}
                <header className="flex justify-between items-center px-2">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-walnut text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">FinAdvice Assistant</h1>
                        <p className="text-walnut/60 text-sm">Ask questions about your finances, get personalized advice.</p>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="glass-panel px-4 py-2 rounded-lg text-sm font-semibold text-walnut hover:bg-white/60 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">add_comment</span>
                        New Chat
                    </button>
                </header>

                {/* Chat Area */}
                <section className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden mx-2 relative">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} max-w-3xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'assistant'
                                        ? 'bg-gradient-to-br from-[#8A2BE2] to-[#FFA500] text-white'
                                        : 'bg-walnut/10 text-walnut'
                                    }`}>
                                    <span className="material-symbols-outlined text-xl">
                                        {msg.role === 'assistant' ? 'auto_awesome' : 'person'}
                                    </span>
                                </div>
                                {/* Message Content */}
                                <div className="flex flex-col gap-2">
                                    <div className={`flex items-baseline gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-bold text-walnut/70 uppercase tracking-wider">
                                            {msg.role === 'assistant' ? 'Assistant' : 'You'}
                                        </span>
                                        <span className="text-[10px] text-walnut/40">{formatTime(msg.timestamp)}</span>
                                    </div>
                                    <div className={`p-5 rounded-2xl text-walnut leading-relaxed shadow-sm ${msg.role === 'assistant'
                                            ? 'glass-panel-clear rounded-tl-none'
                                            : 'bg-walnut/10 rounded-tr-none'
                                        }`}>
                                        <div className="flex flex-col gap-1">
                                            {formatMessageContent(msg.content)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex gap-4 max-w-3xl">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FFA500] flex items-center justify-center shrink-0 shadow-lg text-white">
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-walnut/70 uppercase tracking-wider">Assistant</span>
                                    <div className="glass-panel-clear p-5 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-walnut/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-walnut/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-walnut/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 pt-2 bg-gradient-to-t from-white/40 via-white/20 to-transparent">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2] to-[#FFA500] rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 blur-lg -z-10"></div>
                            <div className="flex items-end gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                <textarea
                                    ref={textareaRef}
                                    className="w-full bg-transparent border-none p-3 text-walnut placeholder-walnut/40 focus:ring-0 resize-none max-h-32 min-h-[48px] text-base leading-relaxed"
                                    placeholder="Ask about spending, loans, runway, or anything financial..."
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 rounded-lg bg-walnut text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-0.5"
                                >
                                    <span className="material-symbols-outlined block text-[20px]">arrow_upward</span>
                                </button>
                            </div>
                            <div className="flex justify-center mt-3">
                                <p className="text-[10px] text-walnut/40 font-medium tracking-wide uppercase">AI-generated insights may vary. Verify critical financial data.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DecisionPage;
