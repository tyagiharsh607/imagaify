import React, { useState, useCallback, ChangeEvent } from 'react';
import { AppStatus } from '../types';
import { transformImage } from '../services/geminiService';
import Navigation from '../components/Navigation';

interface ImageFile {
  file: File;
  base64: string;
}

const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove the data:image/...;base64, part
        };
        reader.onerror = (error) => reject(error);
    });
};

// Icon Components
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v11.494m-9-5.747h18M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
    />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const Header: React.FC = () => (
    <header className="w-full text-center py-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500">
        CharacterFuse AI
      </h1>
      <p className="text-gray-400 mt-2">Turn your photo into a legendary character!</p>
    </header>
);

const ImageUploader: React.FC<{ onImageSelect: (file: File) => void; previewUrl: string | null }> = ({ onImageSelect, previewUrl }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ease-in-out
                ${previewUrl ? 'border-green-500 bg-slate-800' : 'border-gray-600 hover:border-yellow-500 bg-slate-800 hover:bg-slate-700'}`}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                        <UploadIcon className="w-10 h-10 mb-3" />
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">PNG, JPG or WEBP</p>
                    </div>
                )}
                <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
        </div>
    );
};

const ResultDisplay: React.FC<{ original: string; transformed: string; onCreateAnother: () => void; characterName: string }> = ({ original, transformed, onCreateAnother, characterName }) => (
    <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-300">Original</h2>
                <img src={original} alt="Original" className="rounded-lg shadow-lg w-full" />
            </div>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Transformed</h2>
                <img src={`data:image/png;base64,${transformed}`} alt="Transformed" className="rounded-lg shadow-lg shadow-yellow-500/20 w-full" />
            </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
                onClick={onCreateAnother}
                className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-full hover:bg-yellow-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
            >
                Create Another
            </button>
             <a
                href={`data:image/png;base64,${transformed}`}
                download={`${characterName.replace(/\s+/g, '-').toLowerCase()}-characterfuse.png`}
                className="flex items-center justify-center px-8 py-3 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Image
            </a>
        </div>
    </div>
);

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
        <p className="text-lg text-gray-300">Fusing realities... please wait.</p>
    </div>
);

const CharacterFusePage: React.FC = () => {
    const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [characterName, setCharacterName] = useState<string>('');
    const [transformedImage, setTransformedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = useCallback(async (file: File) => {
        try {
            const base64 = await fileToB64(file);
            setOriginalImage({ file, base64 });
            setError(null);
        } catch (err) {
            setError('Could not process the image file.');
            console.error(err);
        }
    }, []);

    const handleTransform = useCallback(async () => {
        if (!originalImage || !characterName.trim()) {
            setError('Please upload an image and enter a character name.');
            return;
        }

        setError(null);
        setStatus(AppStatus.PROCESSING);

        try {
            const resultB64 = await transformImage(originalImage.base64, originalImage.file.type, characterName);
            setTransformedImage(resultB64);
            setStatus(AppStatus.SUCCESS);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setStatus(AppStatus.ERROR);
        }
    }, [originalImage, characterName]);

    const handleCreateAnother = useCallback(() => {
        setStatus(AppStatus.IDLE);
        // Do NOT reset originalImage
        setCharacterName('');
        setTransformedImage(null);
        setError(null);
    }, []);

    const renderContent = () => {
        switch (status) {
            case AppStatus.PROCESSING:
                return <Loader />;
            case AppStatus.SUCCESS:
                if (originalImage && transformedImage) {
                    return <ResultDisplay original={`data:${originalImage.file.type};base64,${originalImage.base64}`} transformed={transformedImage} onCreateAnother={handleCreateAnother} characterName={characterName} />;
                }
                // Fallback to error if data is missing
                setStatus(AppStatus.ERROR);
                setError("Something went wrong displaying the result.");
                return null;
            case AppStatus.IDLE:
            case AppStatus.ERROR:
            default:
                return (
                    <div className="w-full max-w-md mx-auto space-y-6">
                        <ImageUploader onImageSelect={handleImageSelect} previewUrl={originalImage ? `data:${originalImage.file.type};base64,${originalImage.base64}` : null} />
                        <input
                            type="text"
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            placeholder="e.g., Captain Jack Sparrow, Wonder Woman..."
                            className="w-full px-4 py-3 bg-slate-800 border-2 border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                        />
                        <button
                            onClick={handleTransform}
                            disabled={!originalImage || !characterName.trim()}
                            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-full hover:opacity-90 transition-opacity transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <WandIcon className="w-6 h-6 mr-2" />
                            Fuse Image
                        </button>
                        {error && <p className="text-red-400 text-center">{error}</p>}
                    </div>
                );
        }
    };
    
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center p-4 pt-20 selection:bg-yellow-500/30">
                <main className="container mx-auto flex flex-col items-center justify-center flex-grow">
                    {status !== AppStatus.SUCCESS && <Header />}
                    <div className="w-full p-4 md:p-8 mt-8">
                        {renderContent()}
                    </div>
                </main>
                {/* <footer className="text-center py-4 text-gray-500 text-sm">
                    <p>Powered by Gemini. Designed with imagination.</p>
                </footer> */}
            </div>
        </>
    );
};

export default CharacterFusePage;
