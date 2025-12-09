import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm your AI Study Assistant. Ask me anything about your notes, code, or exams! 🤖" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/ai/ask', {
                prompt: userMessage
            });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
        } catch (err) {
            console.error("AI Error:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            setMessages(prev => [...prev, { role: 'ai', content: `Sorry, I encountered an error. ${err.response?.data?.error || 'Please try again later.'}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
                    title="Ask AI Assistant"
                >
                    <Sparkles size={24} />
                    <span className="ml-2 font-bold hidden md:inline">Ask AI</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[500px] flex flex-col overflow-hidden border border-indigo-100 ring-1 ring-black ring-opacity-5 transition-all">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                        <div className="flex items-center space-x-2">
                            <Bot size={24} />
                            <div>
                                <h3 className="font-bold">Study Buddy AI</h3>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    <span className="text-xs text-indigo-100">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-1.5 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    {/* Simple whitespace handling for now, could add ReactMarkdown later */}
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 placeholder-gray-500"
                                placeholder="Ask a question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="ml-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 p-1 rounded-full transition"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="text-center mt-1">
                            <p className="text-[10px] text-gray-400">Powered by Groq</p>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
