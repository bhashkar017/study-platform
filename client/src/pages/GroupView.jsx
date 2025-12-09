import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DiscussionList from '../components/DiscussionList';
import FileList from '../components/FileShare';
import FlashcardsList from '../components/FlashcardsList';
import FlashcardModal from '../components/FlashcardModal';
import StudyCalendar from '../components/StudyCalendar';
import ErrorBoundary from '../components/ErrorBoundary';
import { MessageSquare, FileText, Users, Settings, Trash2, Edit2, LogIn, BookOpen, Calendar as CalIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GroupView = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [activeTab, setActiveTab] = useState('discussions'); // discussions, files, study, calendar, members

    // Flashcard State
    const [studyingDeck, setStudyingDeck] = useState(null);

    const [loading, setLoading] = useState(true);
    const { user, openChat } = useAuth();

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', description: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchGroup();
    }, [groupId]);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            setGroup(res.data);
            setEditFormData({ name: res.data.name, description: res.data.description });
        } catch (err) {
            console.error("Error fetching group:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/groups/${groupId}/join`);
            setGroup(res.data); // Update group data (including new member count)
        } catch (err) {
            alert("Failed to join group");
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}`);
            navigate('/');
        } catch (err) {
            alert("Failed to delete group");
        }
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/groups/${groupId}`, editFormData);
            setGroup(res.data);
            setIsEditing(false);
        } catch (err) {
            alert("Failed to update group");
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    if (!group) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Group not found</div>;

    const isOwner = user && (group.createdBy === user.id || group.createdBy === user._id);

    // Safety check for members
    const safeMembers = group.members?.filter(m => m !== null) || [];

    // Check membership safely
    const isMember = safeMembers.some(m => (m._id || m) === user?.id || (m._id || m) === user?._id);

    if (!isMember) {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{group.name}</h1>
                            <p className="text-gray-600 mb-8">{group.description}</p>
                            <div className="flex items-center justify-center text-gray-500 mb-8">
                                <Users size={24} className="mr-2" />
                                <span className="text-lg">{safeMembers.length} members</span>
                            </div>
                            <button
                                onClick={handleJoinGroup}
                                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-bold text-lg hover:bg-indigo-700 transition flex items-center justify-center"
                            >
                                <LogIn size={24} className="mr-2" />
                                Join Group to View Content
                            </button>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        )
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">

                    {/* Header */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                {!isEditing ? (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                                        <p className="text-gray-600 mb-4">{group.description}</p>
                                    </>
                                ) : (
                                    <form onSubmit={handleUpdateGroup} className="mb-4 space-y-4 max-w-lg">
                                        <input
                                            className="w-full border p-2 rounded text-xl font-bold"
                                            value={editFormData.name}
                                            onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            rows="3"
                                            value={editFormData.description}
                                            onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                        />
                                        <div className="flex space-x-2">
                                            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                        </div>
                                    </form>
                                )}

                                <div className="flex items-center text-gray-500 text-sm">
                                    <Users size={18} className="mr-2" />
                                    <span>{safeMembers.length} members</span>
                                </div>
                            </div>

                            {isOwner && !isEditing && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 transition"
                                        title="Edit Group"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={handleDeleteGroup}
                                        className="p-2 text-gray-400 hover:text-red-600 transition"
                                        title="Delete Group"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('discussions')}
                                className={`${activeTab === 'discussions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <MessageSquare size={18} className="mr-2" /> Discussions
                            </button>
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`${activeTab === 'files' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <FileText size={18} className="mr-2" /> Files
                            </button>
                            <button
                                onClick={() => setActiveTab('study')}
                                className={`${activeTab === 'study' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <BookOpen size={18} className="mr-2" /> Flashcards
                            </button>
                            <button
                                onClick={() => setActiveTab('calendar')}
                                className={`${activeTab === 'calendar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <CalIcon size={18} className="mr-2" /> Schedule
                            </button>
                            <button
                                onClick={() => setActiveTab('members')}
                                className={`${activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <Users size={18} className="mr-2" /> Members
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    {activeTab === 'discussions' && <DiscussionList groupId={groupId} />}
                    {activeTab === 'files' && <FileList groupId={groupId} />}
                    {activeTab === 'study' && (
                        <FlashcardsList
                            groupId={groupId}
                            onStudyDeck={(deck) => setStudyingDeck(deck)}
                        />
                    )}
                    {activeTab === 'calendar' && <StudyCalendar groupId={groupId} />}

                    {activeTab === 'members' && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Group Members ({safeMembers.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {safeMembers.map(member => (
                                    <div key={member._id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 justify-between group">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-3 ${member.profilePicture ? '' : 'bg-indigo-500'}`}>
                                                {member.profilePicture ? (
                                                    <img src={member.profilePicture} className="w-10 h-10 rounded-full object-cover" alt={member.username} />
                                                ) : (
                                                    (member.username || '?')[0].toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.name || member.username}</p>
                                                <p className="text-xs text-gray-500">@{member.username} • Rep: {member.reputation || 0}</p>
                                            </div>
                                        </div>

                                        {((user?.id || user?._id) !== (member._id || member.id)) && (
                                            <button
                                                onClick={() => openChat(member)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition opacity-0 group-hover:opacity-100"
                                                title="Send Message"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Flashcard Modal */}
                {studyingDeck && (
                    <FlashcardModal
                        deck={studyingDeck}
                        onClose={() => setStudyingDeck(null)}
                        isOwner={user && (user._id === group.creator || user.id === group.creator || user._id === studyingDeck.creator._id)}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default GroupView;
