import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useEditor } from './EditorContext';
import { showToast } from '../utils/toast';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isActiveRef = useRef(false);
  const { settings } = useEditor();

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings?.voiceLanguage || 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Voice recognition started');
        isActiveRef.current = true;
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const command = finalTranscript.toLowerCase().trim();
          console.log('Voice command detected:', command);
          setLastCommand(command);
          setTranscript('');
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        
        // Handle different error types
        switch (event.error) {
          case 'no-speech':
            // Silently restart, this is normal
            if (isActiveRef.current) {
              restartRecognition();
            }
            break;
          case 'audio-capture':
            showToast('Microphone not found. Please check your microphone.', 'error');
            setIsListening(false);
            isActiveRef.current = false;
            break;
          case 'not-allowed':
            showToast('Microphone permission denied. Please allow microphone access.', 'error');
            setIsListening(false);
            isActiveRef.current = false;
            break;
          case 'network':
            showToast('Network error. Please check your internet connection.', 'error');
            if (isActiveRef.current) {
              restartRecognition();
            }
            break;
          case 'aborted':
            // Silently handle, usually happens during stop
            break;
          default:
            console.error('Unknown error:', event.error);
            if (isActiveRef.current) {
              restartRecognition();
            }
        }
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        if (isActiveRef.current) {
          restartRecognition();
        }
      };

      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setIsSupported(false);
    }

    return () => {
      isActiveRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
    };
  }, [settings?.voiceLanguage]);

  const restartRecognition = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = setTimeout(() => {
      if (isActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error('Restart error:', error);
          }
        }
      }
    }, 300);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      showToast('Voice control not supported in this browser', 'error');
      return;
    }
    
    try {
      isActiveRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
      showToast('Voice control activated 🎤', 'success');
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        // Already started, just update state
        setIsListening(true);
      } else {
        console.error('Start listening error:', error);
        showToast('Failed to start voice control', 'error');
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      isActiveRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      showToast('Voice control deactivated', 'info');
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const value = {
    isListening,
    lastCommand,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};
