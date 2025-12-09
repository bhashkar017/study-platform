import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, Users, Search, LayoutGrid, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);

    // New UI States
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('my'); // 'my' or 'all'

    const { user } = useAuth();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/groups');
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/groups', newGroup);
            setGroups([...groups, res.data]);
            setShowCreateModal(false);
            setNewGroup({ name: '', description: '' });
            setViewMode('my'); // Switch to my groups to see the new one
        } catch (err) {
            console.error(err);
            alert('Failed to create group');
        }
    };

    // Filter Logic
    const filteredGroups = groups.filter(group => {
        // 1. Search Filter
        const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        // 2. Tab Filter
        const isMember = group.members.some(m => (m._id || m) === user?.id || (m._id || m) === user?._id);
        // Note: user object structure from AuthContext might vary slightly (user.id vs user._id), handling both safely.
        // Also group.members is populated or not? Backend populates members. 

        if (viewMode === 'my') return isMember;
        return true; // 'all' shows everything
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>

                    <div className="flex w-full md:w-auto gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:w-64">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
                        >
                            <Plus size={20} className="mr-2" />
                            Create Group
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setViewMode('my')}
                                className={`${viewMode === 'my'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <LayoutGrid size={18} className="mr-2" />
                                My Groups
                            </button>
                            <button
                                onClick={() => setViewMode('all')}
                                className={`${viewMode === 'all'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <Globe size={18} className="mr-2" />
                                Browse All
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {filteredGroups.map((group) => (
                        <div key={group._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col h-full">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{group.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                            </div>

                            <div className="flex justify-between items-center border-t pt-4 mt-auto">
                                <span className="flex items-center text-gray-500 text-sm">
                                    <Users size={16} className="mr-1" />
                                    {group.members.length} members
                                </span>
                                <Link
                                    to={`/group/${group._id}`}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                >
                                    View Group
                                </Link>
                            </div>
                        </div>
                    ))}
                    {filteredGroups.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No groups found. {viewMode === 'my' ? "Join or create one!" : "Try a different search."}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal - Unchanged logic, just keeping it here */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
                        <form onSubmit={handleCreateGroup}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="3"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
