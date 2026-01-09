import { useState } from 'react';
import axios from 'axios';
import { X, RotateCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const FlashcardModal = ({ deck, onClose, isOwner }) => {
    const [mode, setMode] = useState('study'); // 'study' or 'add'
    const [cards, setCards] = useState(deck.cards || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Add Card State
    const [newCard, setNewCard] = useState({ front: '', back: '' });

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/flashcards/card`, {
                ...newCard,
                deckId: deck._id
            });
            setCards([...cards, res.data]);
            setNewCard({ front: '', back: '' });
        } catch (err) {
            alert("Failed to add card");
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="font-bold text-lg text-gray-800">{deck.title}</h2>
                        <span className="text-xs text-gray-500">{cards.length} cards</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isOwner && (
                            <button
                                onClick={() => setMode(mode === 'study' ? 'add' : 'study')}
                                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
                            >
                                {mode === 'study' ? '+ Add Cards' : 'Back to Study'}
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-100 flex items-center justify-center min-h-[400px]">
                    {mode === 'add' ? (
                        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                            <h3 className="font-bold mb-4 text-gray-700">Add New Card</h3>
                            <form onSubmit={handleAddCard} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Front (Question)</label>
                                    <textarea
                                        required
                                        className="w-full border rounded-md p-2 h-24"
                                        value={newCard.front}
                                        onChange={e => setNewCard({ ...newCard, front: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Back (Answer)</label>
                                    <textarea
                                        required
                                        className="w-full border rounded-md p-2 h-24"
                                        value={newCard.back}
                                        onChange={e => setNewCard({ ...newCard, back: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                                    Save Card
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Study Mode */
                        cards.length > 0 ? (
                            <div className="w-full max-w-lg">
                                {/* Card Construction */}
                                <div
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="bg-white rounded-xl shadow-lg h-80 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-transform transform hover:scale-[1.01] relative perspective-1000"
                                >
                                    <p className="text-xs font-bold text-gray-400 absolute top-4 left-4 uppercase tracking-wider">
                                        {isFlipped ? 'Answer' : 'Question'}
                                    </p>
                                    <p className="text-sm text-gray-400 absolute top-4 right-4">
                                        {currentIndex + 1} / {cards.length}
                                    </p>

                                    <div className="text-2xl font-medium text-gray-800 overflow-y-auto max-h-60 w-full no-scrollbar">
                                        {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
                                    </div>

                                    <div className="absolute bottom-4 text-sm text-indigo-500 flex items-center">
                                        <RotateCw size={14} className="mr-1" /> Click to flip
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex justify-between items-center mt-6">
                                    <button onClick={prevCard} className="p-3 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600">
                                        <ChevronLeft />
                                    </button>
                                    <button onClick={nextCard} className="p-3 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600">
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>This deck is empty.</p>
                                {isOwner && <p className="text-sm">Click "Add Cards" to create content.</p>}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashcardModal;
