const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Share socket.io instance with routes

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.NODE_ENV === 'test'
    ? (process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/studygroup_test')
    : (process.env.MONGO_URI || 'mongodb://localhost:27017/studygroup');

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`Connected to MongoDB: ${MONGO_URI}`))
    .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id); // Quieter logs for tests

    socket.on('join_group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        // console.log(`User joined personal room: ${userId}`);
    });

    socket.on('send_message', (data) => {
        io.to(data.groupId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Study Group API is running');
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const postRoutes = require('./routes/post.routes');
const fileRoutes = require('./routes/file.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flashcards', require('./routes/flashcard.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = server;
