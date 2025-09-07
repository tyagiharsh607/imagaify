import React, { useState, useCallback, useMemo } from 'react';
import { addCelebrityToImage, generateCelebrityName } from '../services/geminiService';
import { ImageFile } from '../types';
import Navigation from '../components/Navigation';

// --- SVG Icon Components ---

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const MaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.854 7.146a.5.5 0 1 1-.708-.708L13.293 2H9.5z"/>
      <path fillRule="evenodd" d="M6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM1 10a5 5 0 1 1 10 0A5 5 0 0 1 1 10z"/>
    </svg>
);

const FemaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13H7a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5z"/>
    </svg>
);

// --- UI Components ---
const Header: React.FC = () => (
  <header className="w-full p-4 text-center">
    <div className="flex items-center justify-center gap-3">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        Celeb<span className="text-amber-400">ify</span>
      </h1>
    </div>
    <p className="text-slate-400 mt-2">Get photobombed by a random celebrity!</p>
  </header>
);

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onSubmit: (gender: 'male' | 'female') => void;
  isLoading: boolean;
  imagePreviewUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onSubmit, isLoading, imagePreviewUrl }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl shadow-slate-950/50">
      <div className="flex flex-col items-center">
        {imagePreviewUrl ? (
          <div className="w-full mb-6">
            <img src={imagePreviewUrl} alt="Your upload" className="rounded-lg object-contain max-h-80 mx-auto shadow-lg" />
          </div>
        ) : (
          <div className="w-full border-2 border-dashed border-slate-600 rounded-lg p-12 text-center mb-6 cursor-pointer hover:border-amber-400 hover:bg-slate-800 transition-colors">
             <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
            <label htmlFor="file-upload" className="cursor-pointer">
              <UploadIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-white font-semibold">Click to upload an image</p>
              <p className="text-sm text-slate-400">PNG, JPG, WEBP</p>
            </label>
          </div>
        )}
        <div className="w-full flex flex-col items-center gap-4">
          {imagePreviewUrl && (
            <>
                <div className="w-full flex justify-center mb-2">
                    <input type="file" id="file-change" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                    <label htmlFor="file-change" className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium">
                      Change Photo
                    </label>
                </div>
                <p className="text-slate-400 text-center mb-2">Who do you want to be photobombed by?</p>
                <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={() => onSubmit('male')}
                        disabled={!imagePreviewUrl || isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105"
                        aria-label="Add a male celebrity"
                    >
                        <MaleIcon className="w-5 h-5" />
                        Male Celebrity
                    </button>
                    <button
                        onClick={() => onSubmit('female')}
                        disabled={!imagePreviewUrl || isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105"
                        aria-label="Add a female celebrity"
                    >
                        <FemaleIcon className="w-5 h-5" />
                        Female Celebrity
                    </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResultDisplayProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  celebrityName: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImageUrl, generatedImageUrl, celebrityName, onReset }) => (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-slate-300">Your Photo</h3>
          <img src={originalImageUrl} alt="Original" className="rounded-xl shadow-2xl shadow-slate-950/50 w-full h-auto object-cover" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-white">With <span className="text-amber-400">{celebrityName}</span></h3>
          <img src={generatedImageUrl} alt={`Generated with ${celebrityName}`} className="rounded-xl shadow-2xl shadow-slate-950/50 w-full h-auto object-cover" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <a
            href={generatedImageUrl}
            download={`${celebrityName.replace(/\s+/g, '-').toLowerCase()}-celebify.png`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-amber-300 transition-all duration-300 transform hover:scale-105"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Image
          </a>
          <button
            onClick={onReset}
            className="w-full sm:w-auto bg-slate-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300 transform hover:scale-105"
          >
            Try Another Photo
          </button>
      </div>
    </div>
);

const Loader: React.FC<{ celebrity: string }> = ({ celebrity }) => {
  const messages = useMemo(() => [
    `Finding ${celebrity}...`,
    'Convincing them to pose...',
    'Adjusting the lighting...',
    'Celebifying your photo...',
    'Almost there!'
  ], [celebrity]);
  const [message, setMessage] = useState(messages[0]);

  React.useEffect(() => {
    setMessage(messages[0]);
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
      <p className="text-xl text-white font-semibold transition-opacity duration-500">{message}</p>
    </div>
  );
};

// --- Main App Component ---
const CelebifyPage: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [celebrity, setCelebrity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBas64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = useCallback((file: File) => {
    handleReset();
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({ file, dataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async (gender: 'male' | 'female') => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    setCelebrity('a surprise celebrity');

    try {
        const randomCelebrity = await generateCelebrityName(gender);
        setCelebrity(randomCelebrity);

        const base64Data = await fileToBas64(image.file);
        const mimeType = image.file.type;
        
        const result = await addCelebrityToImage(base64Data, mimeType, randomCelebrity);

        if (result.newImageBase64) {
            setGeneratedImageUrl(`data:image/png;base64,${result.newImageBase64}`);
        } else {
            throw new Error('Image generation failed, no image was returned.');
        }

    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [image]);

  const handleReset = () => {
    setImage(null);
    setGeneratedImageUrl(null);
    setCelebrity('');
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader celebrity={celebrity} />;
    }
    if (error) {
      return (
        <div className="text-center bg-red-900/50 border border-red-700 p-6 rounded-lg">
          <p className="text-red-300 font-semibold">Oops! Something went wrong.</p>
          <p className="text-red-400 mt-2">{error}</p>
          <button onClick={handleReset} className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">
            Try Again
          </button>
        </div>
      );
    }
    if (generatedImageUrl && image) {
      return (
        <ResultDisplay
          originalImageUrl={image.dataUrl}
          generatedImageUrl={generatedImageUrl}
          celebrityName={celebrity}
          onReset={handleReset}
        />
      );
    }
    return (
        <ImageUploader 
            onImageSelect={handleImageSelect}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            imagePreviewUrl={image?.dataUrl}
        />
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 pt-20 selection:bg-amber-400/30">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_0%,white_75%,transparent_100%)]"></div>
        <main className="relative z-10 flex flex-col items-center justify-center w-full flex-grow gap-8 py-8">
          <Header />
          {renderContent()}
        </main>
        {/* <footer className="relative z-10 text-slate-500 text-sm p-4 text-center">
          Powered by Google Gemini.
        </footer> */}
      </div>
    </>
  );
};

export default CelebifyPage;
