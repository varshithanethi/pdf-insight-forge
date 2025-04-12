
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<any>(null);
  
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptValue = result[0].transcript;
      
      setTranscript(transcriptValue);
      
      if (result.isFinal) {
        onResult(transcriptValue);
      }
    };
    
    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (onError) {
        onError(event.error);
      }
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [onResult, onError, isListening]);
  
  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      toast.info('Voice recognition stopped');
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast.success('Listening... Speak now');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };
  
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isListening ? (
              <div className="flex items-center">
                <span className="inline-block h-3 w-3 rounded-full bg-primary animate-pulse mr-2"></span>
                <span className="text-sm font-medium">Listening...</span>
              </div>
            ) : (
              <span className="text-sm font-medium">Voice Recognition</span>
            )}
          </div>
          
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={toggleListening}
            className="w-10 h-10 p-0 rounded-full"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
        
        {transcript && (
          <div className="mt-4 text-sm p-3 bg-secondary/10 rounded-md max-h-24 overflow-auto">
            <p className="text-muted-foreground">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecognition;
