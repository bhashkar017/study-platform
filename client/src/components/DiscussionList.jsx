import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, User, Trash2, BarChart2, Smile, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import io from 'socket.io-client';

const DiscussionList = ({ groupId }) => {
    const [posts, setPosts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const { user, refreshUser } = useAuth();

    // ...

    // Socket State
    const [socket, setSocket] = useState(null);

    // New Post Form State
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    // State for UI toggles and inputs
    const [activeComments, setActiveComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollOptions, setPollOptions] = useState(['', '']);

    const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);

        newSocket.emit('join_group', groupId);

        newSocket.on('new_post', (post) => {
            setPosts(prev => [post, ...prev]);
        });

        newSocket.on('post_updated', (updatedPost) => {
            setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
        });

        return () => newSocket.close();
    }, [groupId]);

    useEffect(() => {
        fetchPosts();
    }, [groupId]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/group/${groupId}`);
            setPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const postData = { ...newPost, groupId };

            if (showPollCreator) {
                const validOptions = pollOptions.filter(o => o.trim() !== '');
                if (validOptions.length >= 2) {
                    postData.poll = {
                        question: newPost.title, // Use title as question
                        options: validOptions.map(text => ({ text }))
                    };
                }
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, postData);
            setNewPost({ title: '', content: '' });
            setShowPollCreator(false);
            setPollOptions(['', '']);
            setIsCreating(false);
            fetchPosts();
            if (refreshUser) refreshUser();
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    const handleAddComment = async (postId) => {
        const content = commentInputs[postId];
        if (!content?.trim()) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`, { content });
            setCommentInputs({ ...commentInputs, [postId]: '' });
            fetchPosts(); // Refresh to see new comment
            if (refreshUser) refreshUser();
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment/${commentId}`);
            fetchPosts();
            if (refreshUser) refreshUser();
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            alert("Failed to delete post");
        }
    };

    const handleVote = async (postId, optionIndex) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/vote`, { optionIndex });
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const insertEmoji = (emoji) => {
        setNewPost(prev => ({ ...prev, content: prev.content + emoji }));
    };

    return (
        <div className="space-y-6">
            {!isCreating ? (
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full bg-white p-4 rounded-lg shadow border border-dashed border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition flex items-center justify-center h-16"
                >
                    <span className="font-medium">+ Start a new discussion</span>
                </button>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">New Discussion</h3>
                    <form onSubmit={handleCreatePost}>
                        <input
                            type="text"
                            placeholder="Title / Question"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />

                        <div className="relative mb-2">
                            <textarea
                                placeholder="What's on your mind?"
                                required={!showPollCreator}
                                rows="3"
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            ></textarea>
                            <div className="absolute bottom-2 right-2 flex space-x-1">
                                {EMOJIS.map(emoji => (
                                    <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="hover:bg-gray-200 rounded p-1 text-sm">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Poll Creator */}
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => setShowPollCreator(!showPollCreator)}
                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                <BarChart2 size={16} className="mr-1" />
                                {showPollCreator ? "Remove Poll" : "Add Poll"}
                            </button>

                            {showPollCreator && (
                                <div className="mt-2 pl-4 border-l-2 border-indigo-100 space-y-2">
                                    {pollOptions.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            placeholder={`Option ${idx + 1}`}
                                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...pollOptions];
                                                newOpts[idx] = e.target.value;
                                                setPollOptions(newOpts);
                                            }}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        className="text-xs text-gray-500 hover:text-indigo-600"
                                        onClick={() => setPollOptions([...pollOptions, ''])}
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {Array.isArray(posts) && posts.map((post) => {
                    if (!post) return null;
                    const isAuthor = user && post.author && (post.author._id === user.id || post.author._id === user._id || post.author === user.id);
                    const showComments = activeComments[post._id];

                    // Safety for Polls
                    const cleanOptions = post.poll?.options?.filter(o => o) || [];

                    return (
                        <div key={post._id || Math.random()} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>

                                    {/* Poll Display */}
                                    {post.poll && cleanOptions.length > 0 && (
                                        <div className="mb-4 bg-gray-50 p-4 rounded-md">
                                            {cleanOptions.map((option, idx) => {
                                                const votes = option.votes || [];
                                                const totalVotes = cleanOptions.reduce((acc, curr) => acc + (curr.votes?.length || 0), 0);
                                                const percentage = totalVotes === 0 ? 0 : Math.round((votes.length / totalVotes) * 100);
                                                const hasVoted = votes.some(v => (v === user?.id || v === user?._id || v?._id === user?.id || v?._id === user?._id));

                                                return (
                                                    <div key={idx} className="mb-2 last:mb-0">
                                                        <div
                                                            onClick={() => handleVote(post._id, idx)}
                                                            className={`relative border rounded-md p-2 cursor-pointer transition overflow-hidden ${hasVoted ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-100'}`}
                                                        >
                                                            {/* Progress Bar Background */}
                                                            <div
                                                                className="absolute top-0 left-0 bottom-0 bg-indigo-100 transition-all duration-500"
                                                                style={{ width: `${percentage}%`, zIndex: 0 }}
                                                            />
                                                            <div className="relative z-10 flex justify-between items-center">
                                                                <span className="font-medium text-gray-800">{option.text}</span>
                                                                <span className="text-xs text-gray-500">{percentage}% ({votes.length})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <p className="text-xs text-center text-gray-400 mt-2">Click option to vote</p>
                                        </div>
                                    )}

                                </div>
                                {isAuthor && (
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        className="text-gray-400 hover:text-red-500 p-2"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                                <div className="flex items-center">
                                    <User size={16} className="mr-2" />
                                    <span>{post.author?.username || 'Unknown'}</span>
                                    <span className="mx-2">•</span>
                                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
                                </div>
                                <button
                                    onClick={() => setActiveComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                                    className="flex items-center hover:text-indigo-600 transition"
                                >
                                    <MessageCircle size={16} className="mr-2" />
                                    <span>{(post.comments || []).length} comments</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {showComments && (
                                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                                    {/* List Comments */}
                                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                        {(post.comments || []).map((comment, i) => (
                                            <div key={comment._id || i} className="flex space-x-2 group">
                                                <div className="flex-shrink-0">
                                                    {comment.author?.profilePicture ? (
                                                        <img src={comment.author.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                    ) : (
                                                        <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-200">
                                                            {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : (comment.author?.username?.charAt(0).toUpperCase() || <User size={14} />)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="bg-white p-2 rounded-lg shadow-sm flex-1 relative">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-semibold text-gray-800">{comment.author?.name || comment.author?.username || 'User'}</p>
                                                        {user && comment.author && (comment.author._id === user.id || comment.author._id === user._id) && (
                                                            <button
                                                                onClick={() => handleDeleteComment(post._id, comment._id)}
                                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                                                title="Delete Comment"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Comment Input */}
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={commentInputs[post._id] || ''}
                                            onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                                        />
                                        <button
                                            onClick={() => handleAddComment(post._id)}
                                            className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {posts.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No discussions yet. Be the first to start one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionList;
