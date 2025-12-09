import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { Calendar as CalIcon, Plus, X, Clock, Trash2 } from 'lucide-react';

const StudyCalendar = ({ groupId }) => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    // New Event State
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start: '',
        end: ''
    });

    useEffect(() => {
        fetchEvents();
    }, [groupId]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/group/${groupId}`);
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            // Combine date with time
            const selectedDateStr = date.toISOString().split('T')[0];
            const startDateTime = new Date(`${selectedDateStr}T${newEvent.start}`);
            const endDateTime = new Date(`${selectedDateStr}T${newEvent.end}`);

            await axios.post('http://localhost:5000/api/events', {
                title: newEvent.title,
                description: newEvent.description,
                start: startDateTime,
                end: endDateTime,
                groupId
            });

            setIsAdding(false);
            setNewEvent({ title: '', description: '', start: '', end: '' });
            fetchEvents();
        } catch (err) {
            alert("Failed to add event");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
        } catch (err) {
            alert("Failed to delete event");
        }
    };

    // Filter events for selected date
    const eventsForSelectedDate = events.filter(event => {
        const eventDate = new Date(event.start).toDateString();
        return eventDate === date.toDateString();
    });

    // Helper to check if a date has events (for calendar tile content)
    const hasEvents = (d) => {
        return events.some(e => new Date(e.start).toDateString() === d.toDateString());
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center">
                        <CalIcon className="mr-2" /> Schedule
                    </h2>
                </div>
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="w-full border-none shadow-sm rounded-lg p-2"
                    tileClassName={({ date, view }) =>
                        view === 'month' && hasEvents(date) ? 'bg-indigo-50 text-indigo-600 font-bold' : null
                    }
                />
            </div>

            <div className="flex-1 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800">
                        Events for {date.toLocaleDateString()}
                    </h3>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 flex items-center"
                    >
                        <Plus size={16} className="mr-1" /> Add Event
                    </button>
                </div>

                {isAdding && (
                    <form onSubmit={handleAddEvent} className="mb-6 bg-gray-50 p-4 rounded-lg border border-indigo-100 space-y-3">
                        <input
                            type="text"
                            placeholder="Event Title"
                            required
                            className="w-full border rounded px-3 py-2"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={newEvent.start}
                                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">End Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={newEvent.end}
                                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-gray-500">Cancel</button>
                            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
                        </div>
                    </form>
                )}

                <div className="space-y-3">
                    {eventsForSelectedDate.length > 0 ? (
                        eventsForSelectedDate.map(event => (
                            <div key={event._id} className="border-l-4 border-indigo-500 bg-gray-50 p-3 rounded-r-md flex justify-between group">
                                <div>
                                    <h4 className="font-bold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-8">No events scheduled due.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyCalendar;
