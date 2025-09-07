import React, { useState } from 'react';
import { editImageWithPokemon, getRandomPokemonName } from '../services/geminiService';
import type { GenerateContentResponse } from '@google/genai';
import Navigation from '../components/Navigation';

interface UploadedImage {
  base64: string;
  mimeType: string;
}

// Icon Components
const PokeballIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM12 4c4.411 0 8 3.589 8 8H4c0-4.411 3.589-8 8-8zm0 16c-4.411 0-8-3.589-8-8h16c0 4.411-3.589 8-8 8z"></path>
        <path d="M12 10c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
    </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const DiceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// Component Definitions
const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="flex items-center justify-center gap-4">
                <PokeballIcon className="w-10 h-10 text-amber-500"/>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-400">
                    PokéFusion
                </h1>
            </div>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Upload your photo, choose a Pokémon and style, and let AI bring it into your world!
            </p>
        </header>
    );
};

interface ControlsProps {
    pokemonName: string;
    setPokemonName: (name: string) => void;
    pokemonStyle: string;
    setPokemonStyle: (style: string) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRandomPokemon: () => void;
    onGenerate: () => void;
    isLoading: boolean;
    isFetchingRandom: boolean;
    isImageUploaded: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    pokemonName,
    setPokemonName,
    pokemonStyle,
    setPokemonStyle,
    onImageUpload,
    onRandomPokemon,
    onGenerate,
    isLoading,
    isFetchingRandom,
    isImageUploaded
}) => {
    const POKEMON_STYLES = ["Anime / Cartoon", "Realistic / Live-Action", "Claymation", "Pixel Art", "Watercolor"];

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-6 sticky top-8 shadow-lg">
            <div className="space-y-2">
                <label htmlFor="image-upload" className="font-semibold text-gray-300">1. Upload Your Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none">
                    <span className="flex items-center space-x-2">
                        <UploadIcon className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-400">
                           {isImageUploaded ? 'Image selected!' : 'Click to upload'}
                        </span>
                    </span>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onImageUpload} disabled={isLoading} />
                </label>
            </div>

            <div className="space-y-2">
                <label htmlFor="pokemon-name" className="font-semibold text-gray-300">2. Choose a Pokémon</label>
                <input
                    id="pokemon-name"
                    type="text"
                    value={pokemonName}
                    onChange={(e) => setPokemonName(e.target.value)}
                    placeholder="e.g., Charizard"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={isLoading || isFetchingRandom}
                />
                 <button
                    onClick={onRandomPokemon}
                    disabled={isLoading || isFetchingRandom}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-amber-400 text-slate-900 border border-amber-900 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isFetchingRandom ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching...
                        </>
                    ) : (
                        <>
                            <DiceIcon className="w-5 h-5"/>
                            Random Pokémon
                        </>
                    )}
                </button>
            </div>

             <div className="space-y-2">
                <label htmlFor="pokemon-style" className="font-semibold text-gray-300">3. Choose a Style</label>
                <select
                    id="pokemon-style"
                    value={pokemonStyle}
                    onChange={(e) => setPokemonStyle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={isLoading}
                >
                    {POKEMON_STYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !isImageUploaded || isFetchingRandom}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-slate-900 bg-amber-400 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400 transition disabled:opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6" />
                            Generate Fusion
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

interface ImageDisplayProps {
    originalImage: { base64: string; mimeType: string; } | null;
    generatedImage: string | null;
    generatedText: string | null;
    isLoading: boolean;
    pokemonName: string;
}

const ImageCard: React.FC<{ src: string | null; title: string; isLoading?: boolean; isPlaceholder?: boolean; children?: React.ReactNode }> = ({ src, title, isLoading = false, isPlaceholder = false, children }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col shadow-sm">
            <h3 className="text-lg font-bold text-gray-200 text-center mb-4">{title}</h3>
            <div className="aspect-square w-full rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden relative">
                {isLoading ? (
                    <div className="w-full h-full animate-pulse bg-gray-700 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <svg className="animate-spin h-8 w-8 text-gray-300 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="font-semibold mt-2">AI is working its magic...</p>
                        <p className="text-sm">This can take a moment.</p>
                    </div>
                ) : src ? (
                    <img src={src} alt={title} className="w-full h-full object-contain" />
                ) : isPlaceholder ? (
                    <div className="text-center text-gray-400 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <p>{title === "Your Photo" ? "Upload a photo to begin" : "AI result will appear here"}</p>
                    </div>
                ) : null}
            </div>
            {children}
        </div>
    );
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage, generatedText, isLoading, pokemonName }) => {
    const originalImageUrl = originalImage ? `data:${originalImage.mimeType};base64,${originalImage.base64}` : null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageCard src={originalImageUrl} title="Your Photo" isPlaceholder={!originalImageUrl} />
                <ImageCard src={generatedImage} title="AI Fusion" isLoading={isLoading} isPlaceholder={!generatedImage}>
                     {generatedImage && !isLoading && (
                        <a
                            href={generatedImage}
                            download={`${pokemonName.replace(/\s+/g, '-').toLowerCase()}-pokefusion.png`}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <DownloadIcon className="w-5 h-5"/>
                            Download Image
                        </a>
                    )}
                </ImageCard>
            </div>
            {generatedText && !isLoading && (
                 <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-200 mb-2">AI Description:</h3>
                    <p className="text-gray-400 italic">"{generatedText}"</p>
                </div>
            )}
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="text-center mt-12 py-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
                Powered by Google Gemini. This is a creative application and not affiliated with Nintendo or The Pokémon Company.
            </p>
        </footer>
    );
};

// Main Component
const PokeFusionPage: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>('Pikachu');
  const [pokemonStyle, setPokemonStyle] = useState<string>('Anime / Cartoon');
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingRandom, setIsFetchingRandom] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setOriginalImage({ base64: base64String, mimeType: file.type });
        setGeneratedImage(null);
        setGeneratedText(null);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomPokemon = async () => {
    setIsFetchingRandom(true);
    setError(null);
    try {
      const pokedexNumber = Math.floor(Math.random() * 1025) + 1;
      const name = await getRandomPokemonName(pokedexNumber);
      setPokemonName(name);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch a random Pokémon name.");
    } finally {
      setIsFetchingRandom(false);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!pokemonName.trim()) {
      setError("Please enter a Pokémon name.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const response: GenerateContentResponse = await editImageWithPokemon(originalImage.base64, originalImage.mimeType, pokemonName, pokemonStyle);
      
      let foundImage = false;
      let textContent = '';

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          setGeneratedImage(`data:${part.inlineData.mimeType};base64,${base64ImageBytes}`);
          foundImage = true;
        }
        if (part.text) {
          textContent += part.text + ' ';
        }
      }
      
      setGeneratedText(textContent.trim());

      if (!foundImage) {
          throw new Error("The AI did not return an image. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col p-4 pt-24 sm:p-6 sm:pt-28 lg:p-8 lg:pt-28 selection:bg-amber-400/30">
        <Header />
        <main className="flex-grow container mx-auto max-w-7xl w-full mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <Controls
                pokemonName={pokemonName}
                setPokemonName={setPokemonName}
                pokemonStyle={pokemonStyle}
                setPokemonStyle={setPokemonStyle}
                onImageUpload={handleImageUpload}
                onRandomPokemon={handleRandomPokemon}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                isFetchingRandom={isFetchingRandom}
                isImageUploaded={!!originalImage}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              {error && (
                <div className="mb-4 bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <ImageDisplay
                originalImage={originalImage}
                generatedImage={generatedImage}
                generatedText={generatedText}
                isLoading={isLoading}
                pokemonName={pokemonName}
              />
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default PokeFusionPage;
