# 📚 StudyGroup - Collaborative Learning Platform

A full-stack MERN application designed to help students organize study groups, share resources, and collaborate effectively.

## 🚀 Features

### 👥 Group Management
- **Create & Join Groups**: Users can create study groups for specific subjects or join existing ones.
- **Member Roles**: Creators have admin privileges (edit/delete group).
- **Reputation System**: Earn points for contributing (posts, comments) and lose points for deleting content.

### 💬 Collaborative Tools
- **Discussion Forums**: Threaded discussions with rich text support.
- **Real-time Chat (DMs)**: Private 1-on-1 messaging with other users.
- **Polls**: Create and vote on polls within discussions.
- **File Sharing**: Upload and share study materials (PDFs, Images) with group members.

### 🧠 Study Aids
- **Flashcards**: Create decks, add cards, and use the "Study Mode" to flip through them.
- **Study Calendar**: Schedule events, exams, and study sessions.

### 🎨 Modern UI/UX
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on all devices.
- **Real-time Updates**: Powered by Socket.io for instant notifications on posts and messages.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/studygroup.git
    cd studygroup
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create a .env file based on .env.example (MONGO_URI, JWT_SECRET, PORT)
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
