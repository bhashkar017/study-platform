import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FlashcardsList = ({ groupId, onStudyDeck }) => {
    const [decks, setDecks] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newDeck, setNewDeck] = useState({ title: '', description: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchDecks();
    }, [groupId]);

    const fetchDecks = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/flashcards/group/${groupId}`);
            setDecks(res.data);
        } catch (err) {
            console.error("Error fetching decks:", err);
        }
    };

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/flashcards/deck', {
                ...newDeck,
                groupId
            });
            setIsCreating(false);
            setNewDeck({ title: '', description: '' });
            fetchDecks();
        } catch (err) {
            alert("Failed to create deck");
        }
    };

    const handleDeleteDeck = async (deckId) => {
        if (!window.confirm("Delete this deck all cards?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/flashcards/deck/${deckId}`);
            setDecks(decks.filter(d => d._id !== deckId));
        } catch (err) {
            alert("Failed to delete deck");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                    <BookOpen className="mr-2" /> Study Decks
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                >
                    <Plus size={16} className="mr-1" /> New Deck
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateDeck} className="bg-white p-4 rounded-lg shadow space-y-3 border border-indigo-100">
                    <input
                        type="text"
                        placeholder="Deck Title (e.g. Chapter 1 Vocab)"
                        required
                        className="w-full border rounded px-3 py-2"
                        value={newDeck.title}
                        onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description (Optional)"
                        className="w-full border rounded px-3 py-2"
                        value={newDeck.description}
                        onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1 text-gray-500">Cancel</button>
                        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks.map(deck => (
                    <div key={deck._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 relative group">
                        <h3 className="font-bold text-lg text-gray-800">{deck.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{deck.cards.length} cards • by {deck.creator?.username}</p>
                        <p className="text-gray-600 text-sm mb-4">{deck.description}</p>

                        <button
                            onClick={() => onStudyDeck(deck)}
                            className="w-full bg-indigo-50 text-indigo-700 font-medium py-2 rounded hover:bg-indigo-100 transition"
                        >
                            Study Now
                        </button>

                        {(user._id === deck.creator?._id || user.id === deck.creator?._id) && (
                            <button
                                onClick={() => handleDeleteDeck(deck._id)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {decks.length === 0 && (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <BookOpen size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No study decks yet. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default FlashcardsList;
