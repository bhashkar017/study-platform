import React from 'react';
import { Github, Linkedin, Mail, Globe, Code, ExternalLink, Terminal, Coffee, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Developer = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            {/* Navbar Placeholder/Back Button */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md shadow-lg py-4 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer italic">
                        StudyPlatform
                    </Link>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <span>← Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-10 mb-16 animate-fade-in-up">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800 flex items-center justify-center">
                            {/* Placeholder for Developer Image - Replace src with actual image */}
                            <img
                                src="https://ui-avatars.com/api/?name=Bhashkar+Anand&background=random&size=256"
                                alt="Bhashkar Anand"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-purple-300 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                            Creator & Lead Developer
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                            Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Bhashkar</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                            Full-Stack Developer passionate about building intuitive, scalable, and beautiful web applications.
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                            <a href="https://github.com/bhashkar017" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all hover:scale-110" title="GitHub">
                                <Github size={24} />
                            </a>
                            <a href="https://www.linkedin.com/in/bhashkar-anand-a21569284/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-full text-blue-400 hover:text-white hover:bg-blue-600 transition-all hover:scale-110" title="LinkedIn">
                                <Linkedin size={24} />
                            </a>
                            <a href="mailto:anandbhashkar2005@gmail.com" className="p-3 bg-gray-800 rounded-full text-pink-400 hover:text-white hover:bg-pink-600 transition-all hover:scale-110" title="Email">
                                <Mail size={24} />
                            </a>
                            <a href="tel:+916299215502" className="p-3 bg-gray-800 rounded-full text-green-400 hover:text-white hover:bg-green-600 transition-all hover:scale-110" title="Phone">
                                <Phone size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 animate-fade-in-up animation-delay-200">
                    <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-purple-400">
                            <Terminal className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">About The Project</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            I built <span className="font-semibold text-white">StudyPlatform</span> with a vision to revolutionize how students simplify their academic lives. Utilizing the MERN stack, I focused on creating a seamless, real-time collaborative environment.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            From the interactive AI assistant to the real-time chat and resource sharing, every feature was crafted to enhance productivity and learning efficiency.
                        </p>
                    </div>

                    <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 text-pink-400">
                            <Code className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">Tech Stack</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'Socket.io', 'OpenAI API', 'JWT', 'Vite'].map((tech) => (
                                <span key={tech} className="px-3 py-1.5 bg-gray-900 text-gray-300 rounded-lg text-sm font-medium border border-gray-700">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Signature Section */}
                        <div className="border-t border-gray-700/50 pt-6 mt-auto">
                            <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Digital Signature</p>
                            <div className="font-cursive text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 rotate-[-5deg] inline-block" style={{ fontFamily: '"Dancing Script", "Brush Script MT", cursive' }}>
                                Bhashkar Anand
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer link back */}
                <div className="mt-20 text-center border-t border-gray-800 pt-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium">
                        Return to Platform <ExternalLink size={16} />
                    </Link>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-cursive {
                    font-family: 'Dancing Script', cursive;
                }
            `}</style>
        </div>
    );
};

export default Developer;
