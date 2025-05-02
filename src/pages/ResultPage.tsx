
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrawStore } from '@/store/useDrawStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ResultPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Simulated image generation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // In a real app, we'd get the actual generated image URL
              setResultImage("https://images.unsplash.com/photo-1506744038136-46273834b3fb");
              setIsGenerating(false);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);
  
  const handleDownload = () => {
    // In a real app, this would download the actual generated image
    const link = document.createElement('a');
    link.href = resultImage || '';
    link.download = `vibecanva-${roomId}.jpg`;
    link.click();
  };
  
  const handleRestart = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-app-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">VibeCanva Result</h1>
          <p className="text-gray-600">Room: {roomId}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {isGenerating ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">Generating Your Masterpiece</h2>
                <p className="text-gray-500 mb-4">Combining your drawings into something amazing...</p>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="text-center text-sm text-gray-500">
                {progress}% complete
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">Your Creation Is Ready!</h2>
                <p className="text-gray-500 mb-4">Here's what we generated from your collaborative artwork</p>
              </div>
              
              {resultImage && (
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={resultImage} 
                    alt="Generated artwork" 
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button onClick={handleDownload}>
                  Download Image
                </Button>
                
                <Button variant="outline" onClick={handleRestart}>
                  New Drawing
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
