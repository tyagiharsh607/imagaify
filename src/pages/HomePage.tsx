import React from 'react';
import { Link } from 'react-router-dom';

// Icon components
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 selection:bg-purple-400/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_0%,white_75%,transparent_100%)]"></div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">
              ImagAIfy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Transform your photos with the power of AI. Choose your magic and create something extraordinary.
          </p>
        </header>

        {/* App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

          {/* Celebify Card */}
          <Link
            to="/celebify"
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-amber-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <StarIcon className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-400 mb-3">Celebify</h2>
                <p className="text-slate-400 leading-relaxed">
                  Get photobombed by random celebrities! Upload your photo and let AI add famous faces to create hilarious moments.
                </p>
              </div>
              <div className="flex items-center text-amber-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Try Celebify
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* CharacterFuse Card */}
          <Link
            to="/characterfuse"
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <WandIcon className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-3">CharacterFuse AI</h2>
                <p className="text-slate-400 leading-relaxed">
                  Transform into legendary characters! Keep your face while changing into any fictional character you can imagine.
                </p>
              </div>
              <div className="flex items-center text-yellow-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Try CharacterFuse
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* PokéFusion Card */}
          <Link
            to="/pokefusion"
            className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-amber-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <SparklesIcon className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-400 mb-3">PokéFusion</h2>
                <p className="text-slate-400 leading-relaxed">
                  Add Pokémon to your world! Choose from 1000+ Pokémon and multiple artistic styles for magical photo adventures.
                </p>
              </div>
              <div className="flex items-center text-amber-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Try PokéFusion
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

        </div>

        {/* Features Section */}
        <div className="mt-20 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-slate-300 mb-8">Powered by Advanced AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-300">Lightning Fast</h4>
              <p className="text-sm text-slate-500">Generate stunning images in seconds</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-300">High Quality</h4>
              <p className="text-sm text-slate-500">Professional-grade AI transformations</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-300">Privacy First</h4>
              <p className="text-sm text-slate-500">Your images are processed securely</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-slate-500 text-sm p-8 text-center mt-16">
        <p>Powered by Google Gemini AI • Built with ❤️ for creative minds</p>
      </footer>
    </div>
  );
};

export default HomePage;
