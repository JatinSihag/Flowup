import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-5 font-inter
                    bg-[url('/background.jpeg')] bg-no-repeat bg-gray-900
                    bg-cover bg-center bg-fixed">
            <header className="text-center mb-5">
                <h1 className="text-6xl font-extrabold text-blue-400 mb-3 animate-fade-in-down">
                    Welcome to FlowUp
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
                    Your ultimate solution for seamless task management. Organize, assign, and track tasks effortlessly.
                </p>
            </header>

            <section className="mb-7 w-full max-w-4xl px-4">
                <img
                    src="/mid.jpeg"
                    alt="Task Management Workflow"
                    className="w-full h-auto rounded-xl shadow-2xl border border-blue-600 object-cover transform hover:scale-[1.01] transition-transform duration-300 ease-in-out"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found"; }}
                />
            </section>

            <section className="flex flex-col md:flex-row gap-6 mb-4">
                <Link
                    to="/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg text-center"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg text-center"
                >
                    Register
                </Link>
            </section>

            <footer className="text-gray-500 text-sm mt-auto">
                &copy; {new Date().getFullYear()} Flowup. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
