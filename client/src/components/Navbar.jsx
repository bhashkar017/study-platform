import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut, Camera, Bell, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatDrawer from './ChatDrawer';

const Navbar = () => {
    const { user, logout, login, chatState, openChat, closeChat } = useAuth(); // Assuming login or updateUser updates context
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const resultRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const res = await axios.post('http://localhost:5000/api/users/profile/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local user state
            // We can re-call login to update the user in local storage and context
            // Assuming res.data.user contains the updated user object with new profilePicture URL
            // We need the current token, which we can grab from localStorage
            const token = localStorage.getItem('token');
            if (token) {
                login(token, res.data.user);
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload profile picture");
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultRef.current && !resultRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const ProfileAvatar = ({ size = 10, src, name, altClass = "" }) => {
        if (src) {
            return <img src={src} alt="Profile" className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-sm ${altClass}`} />;
        }
        return (
            <div className={`w-${size} h-${size} bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-inner ${altClass}`}>
                {name ? name.charAt(0).toUpperCase() : <User size={size * 2} />}
            </div>
        );
    };

    return (
        <nav className="bg-indigo-600 shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-white text-2xl font-bold tracking-tight">StudyGroup</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-2">
                            {/* Messages Toggle */}
                            <button
                                onClick={() => openChat()}
                                className="text-indigo-100 hover:text-white p-2 rounded-full hover:bg-indigo-700 transition"
                            >
                                <MessageSquare size={20} />
                            </button>

                            <div className="relative" ref={resultRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-indigo-100 hover:text-white p-2 rounded-md focus:outline-none transition-colors flex items-center"
                                >
                                    <ProfileAvatar size={8} src={user.profilePicture} name={user.name || user.username} />
                                    <Menu size={20} className="ml-2" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 transform transition-all ease-out duration-200 origin-top-right">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col items-center relative">
                                            <div className="group relative cursor-pointer" onClick={handleUploadClick}>
                                                <ProfileAvatar size={24} src={user.profilePicture} name={user.name || user.username} />
                                                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="text-white" />
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />

                                            <h3 className="text-xl font-bold text-gray-900 mt-3">{user.name || user.username}</h3>
                                            <p className="text-sm text-gray-500">@{user.username}</p>
                                            <div className="mt-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                                <span className="text-xs font-semibold text-indigo-600">🏆 Reputation: {user.reputation || 0}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut size={18} className="mr-3" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="text-indigo-200 hover:text-white transition">Login</Link>
                            <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
            <ChatDrawer isOpen={chatState.isOpen} onClose={closeChat} initialActiveChat={chatState.activeUser} />
        </nav>
    );
};

export default Navbar;
