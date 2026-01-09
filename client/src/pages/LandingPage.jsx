import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center italic">
                    <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer">
                        StudyPlatform
                    </div>
                    <div className="space-x-4">
                        <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-900 hover:bg-gray-100 transition-transform hover:scale-105 duration-300 shadow-lg shadow-white/10">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm text-sm font-medium text-purple-300 animate-fade-in-up">
                        ✨ Revolutionizing how students collaborate
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up animation-delay-100">
                        Elevate Your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Learning Experience
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                        Join a collaborative ecosystem designed for students. Organize study groups, share resources, and leverage AI to master your subjects.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
                        <Link to="/register" className="px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1">
                            Start Learning Now
                        </Link>
                        <Link to="/login" className="px-8 py-4 rounded-full text-lg font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300">
                            Welcome Back
                        </Link>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-20 relative animate-fade-in-up animation-delay-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-t-3xl blur-2xl"></div>
                        <div className="relative rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden max-w-5xl mx-auto group">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                                alt="Students Collaborating"
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-gray-900 border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">10k+</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Active Students</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">500+</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Study Groups</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">1M+</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Resources Shared</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">24/7</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">AI Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features (How it works) */}
            <div className="py-24 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0  flex justify-center flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
                        Everything you need <br /> to <span className="text-purple-400">excel</span>
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Interactive Study Groups</h3>
                            <p className="text-gray-400 leading-relaxed">Find peers studying the same subjects. Create private or public groups to share notes, discuss topics, and stay motivated together.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Smart AI Assistant</h3>
                            <p className="text-gray-400 leading-relaxed">Stuck on a concept? Our context-aware AI tutor provides instant explanations, generates quizzes, and summarizes lengthy documents.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Seamless Sharing</h3>
                            <p className="text-gray-400 leading-relaxed">Upload lectures, assignments, and notes in any format. Organize them by subject and verify quality with community upvotes.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-gray-800/30 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-purple-400 font-semibold tracking-wide uppercase text-sm">Getting Started</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2">How it works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-700 via-purple-500/50 to-gray-700 z-0"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-xl">1</div>
                            <h3 className="text-xl font-bold mb-2">Create Profile</h3>
                            <p className="text-gray-400">Sign up in seconds and customize your academic profile with your subjects and interests.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-purple-500/30 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-xl shadow-purple-900/20">2</div>
                            <h3 className="text-xl font-bold mb-2">Join Groups</h3>
                            <p className="text-gray-400">Discover groups matching your courses or create your own private study circle.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-xl">3</div>
                            <h3 className="text-xl font-bold mb-2">Start Learning</h3>
                            <p className="text-gray-400">Share resources, chat with peers, and use AI tools to boost your productivity.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery / App Highlight */}
            <div className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for focus <br /> and <span className="text-pink-500">clarity</span></h2>
                        <ul className="space-y-4">
                            <li className="flex items-center text-lg text-gray-300">
                                <span className="w-6 h-6 mr-3 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">✓</span>
                                Distraction-free interface
                            </li>
                            <li className="flex items-center text-lg text-gray-300">
                                <span className="w-6 h-6 mr-3 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">✓</span>
                                Dark mode optimized for late-night sessions
                            </li>
                            <li className="flex items-center text-lg text-gray-300">
                                <span className="w-6 h-6 mr-3 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">✓</span>
                                Real-time notifications and updates
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 group">
                                See all features
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl transform rotate-3"></div>
                        <div className="relative rounded-xl border border-gray-700 shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500 group">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
                                alt="Dashboard Preview"
                                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            {/* Overlay Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 bg-gray-900 border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Trusted by Students</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50">
                            <div className="text-yellow-400 mb-4 flex gap-1">★★★★★</div>
                            <p className="text-gray-300 mb-6 italic">"This platform literally saved my semester. The study groups are super active and the AI summaries are a game changer."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">JD</div>
                                <div>
                                    <div className="font-bold">John Doe</div>
                                    <div className="text-xs text-gray-500">Computer Science Student</div>
                                </div>
                            </div>
                        </div>
                        {/* Review 2 */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50">
                            <div className="text-yellow-400 mb-4 flex gap-1">★★★★★</div>
                            <p className="text-gray-300 mb-6 italic">"I love how organized everything is. Finding notes for my specific engineering courses used to be a nightmare, not anymore."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">AS</div>
                                <div>
                                    <div className="font-bold">Alice Smith</div>
                                    <div className="text-xs text-gray-500">Engineering Major</div>
                                </div>
                            </div>
                        </div>
                        {/* Review 3 */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50">
                            <div className="text-yellow-400 mb-4 flex gap-1">★★★★★</div>
                            <p className="text-gray-300 mb-6 italic">"The real-time collaboration tools are fantastic. It feels like we're all in the same library even when we're at home."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">MK</div>
                                <div>
                                    <div className="font-bold">Mike K.</div>
                                    <div className="text-xs text-gray-500">Med Student</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Meet the Creator Section */}
            <div className="py-24 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-800/40 p-10 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-500">
                        <div className="w-48 h-48 flex-shrink-0 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            <img
                                src="https://ui-avatars.com/api/?name=Bhashkar+Anand&background=random&size=256"
                                alt="Bhashkar Anand"
                                className="relative w-full h-full object-cover rounded-full border-4 border-gray-900"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-4">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Creator</span></h2>
                            <p className="text-xl text-gray-300 mb-6 font-medium">Bhashkar Anand</p>
                            <p className="text-gray-400 mb-8 max-w-xl leading-relaxed">
                                Passionate about educational technology and building tools that make a difference in students' lives.
                                This platform is a result of dedicated full-stack engineering.
                            </p>
                            <Link to="/developer" className="inline-flex items-center px-6 py-3 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-purple-500 transition-all group">
                                <span className="mr-2">View Developer Profile</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 -z-10"></div>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to boost your grades?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of students who are already learning smarter, not harder.</p>
                    <Link to="/register" className="inline-block px-10 py-5 rounded-full text-xl font-bold bg-white text-gray-900 hover:scale-105 transition-transform shadow-2xl shadow-purple-500/20">
                        Join Platform for Free
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 bg-gray-950 border-t border-gray-900 text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-bold tracking-tighter text-white mb-4 italic">
                            StudyPlatform
                        </div>
                        <p className="text-gray-500 max-w-xs">Empowering students worldwide with cutting-edge collaboration tools and AI assistance.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li className="hover:text-purple-400 cursor-pointer">Study Groups</li>
                            <li className="hover:text-purple-400 cursor-pointer">AI Assistant</li>
                            <li className="hover:text-purple-400 cursor-pointer">Pricing</li>
                            <li><Link to="/developer" className="hover:text-purple-400 cursor-pointer">Developer</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li className="hover:text-purple-400 cursor-pointer">Help Center</li>
                            <li className="hover:text-purple-400 cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-purple-400 cursor-pointer">Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-gray-600 pt-8 border-t border-gray-900 flex flex-col items-center gap-2">
                    <p>&copy; {new Date().getFullYear()} StudyPlatform. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <span className="text-red-500">❤️</span> by
                        <Link to="/developer" className="text-purple-400 hover:text-purple-300 font-medium">Bhashkar</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
