import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Send, MessageSquare, ChevronLeft, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChatDrawer = ({ isOpen, onClose, initialActiveChat }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // The user object of the person we are chatting with
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (initialActiveChat) {
            setActiveChat(initialActiveChat);
        }
    }, [initialActiveChat]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [socket, setSocket] = useState(null);

    // Initial Socket Connection
    useEffect(() => {
        if (!user) return;

        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_user_room', user.id || user._id);
        });

        newSocket.on('private_message', (message) => {
            // If chat is open with sender, append message
            // Otherwise, maybe update unread count (future) or move conversation to top
            setMessages(prev => {
                // Only append if the message belongs to the current active chat
                if (activeChat && (message.sender._id === activeChat._id || message.recipient._id === activeChat._id)) {
                    return [...prev, message];
                }
                return prev;
            });
            fetchConversations(); // Refresh list to show latest message snippet
        });

        return () => newSocket.close();
    }, [user, activeChat]);

    // Fetch conversations when drawer opens
    useEffect(() => {
        if (isOpen && user) {
            fetchConversations();
        }
    }, [isOpen, user]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat._id);
        }
    }, [activeChat]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/messages/conversations/all');
            setConversations(res.data);
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const fetchMessages = async (otherUserId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/messages/${otherUserId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const res = await axios.post('http://localhost:5000/api/messages', {
                recipientId: activeChat._id,
                content: newMessage
            });

            setMessages([...messages, res.data]);
            setNewMessage('');
            fetchConversations(); // Update snippet
        } catch (err) {
            alert("Failed to send message");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
            <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
                <div className="w-full h-full flex flex-col bg-white shadow-xl">

                    {/* Header */}
                    <div className="px-4 py-3 bg-indigo-600 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center">
                            {activeChat ? (
                                <button onClick={() => setActiveChat(null)} className="mr-2 hover:bg-indigo-700 p-1 rounded">
                                    <ChevronLeft size={20} />
                                </button>
                            ) : (
                                <MessageSquare size={20} className="mr-2" />
                            )}
                            <h2 className="text-lg font-semibold">
                                {activeChat ? activeChat.username : 'Messages'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {!activeChat ? (
                            // Conversation List
                            <div className="divide-y divide-gray-200">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>No conversations yet.</p>
                                    </div>
                                ) : (
                                    conversations.map((conv, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveChat(conv.user)}
                                            className="px-4 py-3 hover:bg-white cursor-pointer transition flex items-center"
                                        >
                                            <div className="flex-shrink-0 mr-3">
                                                {conv.user.profilePicture ? (
                                                    <img src={conv.user.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                        {conv.user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{conv.user.username}</p>
                                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                                            </div>
                                            <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {new Date(conv.lastMessage?.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Active Chat
                            <div className="flex flex-col h-full">
                                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                                    {messages.map((msg, i) => {
                                        const isMe = msg.sender._id === (user.id || user._id);
                                        return (
                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="ml-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatDrawer;
