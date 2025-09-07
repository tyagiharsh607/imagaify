# Imagaify - AI Image Magic ✨

A unified React application that combines three powerful AI image manipulation tools powered by Google Gemini AI.

## 🚀 Features

### 🌟 Celebify
- **Get photobombed by celebrities!** Upload your photo and choose male/female preference
- AI generates random celebrity names and seamlessly adds them to your images
- Celebrities interact naturally with people in photos (arm around shoulder, laughing, etc.)
- Beautiful amber-themed UI with engaging loading animations

### ⚡ CharacterFuse AI
- **Transform into fictional characters!** Upload your photo and specify any character name
- AI changes only clothing, hair, and accessories while preserving your face and background
- Strict preservation of facial features for realistic costume transformations
- Clean yellow gradient UI with before/after comparison

### 🎮 PokéFusion
- **Add Pokémon to your world!** Upload photos and choose from 1000+ Pokémon
- Multiple artistic styles: Anime/Cartoon, Realistic/Live-Action, Claymation, Pixel Art, Watercolor
- Random Pokémon selection feature for surprise encounters
- Pokémon interact naturally with people and environments
- Dark gaming-themed UI with comprehensive controls

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Google Gemini AI** for image generation
- **Modern ES modules** and build optimization

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd imagaify
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
# Create a .env file in the root directory
echo "API_KEY=your_google_gemini_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔑 API Key Setup

You'll need a Google Gemini API key to use this application:

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `API_KEY=your_key_here`

## 🎯 Usage

1. **Homepage**: Choose from three AI-powered image tools
2. **Navigation**: Use the top navigation bar to switch between tools or return home
3. **Image Upload**: All tools support PNG, JPG, and WEBP formats
4. **Download**: Save your AI-generated images directly to your device

## 🏗️ Project Structure

```
imagaify/
├── src/
│   ├── components/          # Shared components
│   │   └── Navigation.tsx   # App navigation
│   ├── pages/              # Main application pages
│   │   ├── HomePage.tsx    # Landing page with app selection
│   │   ├── CelebifyPage.tsx
│   │   ├── CharacterFusePage.tsx
│   │   └── PokeFusionPage.tsx
│   ├── services/           # API services
│   │   └── geminiService.ts # Google Gemini AI integration
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design Philosophy

- **Unified Experience**: Consistent navigation and theming across all tools
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance First**: Optimized loading states and error handling
- **User-Friendly**: Intuitive interfaces with clear visual feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for creative and educational purposes. It is not affiliated with any celebrity, fictional character franchise, Nintendo, or The Pokémon Company. All AI-generated content should be used responsibly and in accordance with applicable laws and platform policies.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the image generation
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **Vite** for the lightning-fast build tool
