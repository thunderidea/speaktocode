import React, { useEffect, useState, useCallback } from 'react';
import { useVoice } from '../../context/VoiceContext';
import { useEditor } from '../../context/EditorContext';
import { processVoiceCommand } from '../../utils/voiceCommands';
import './VoiceControl.css';

const VoiceControl = () => {
  const { isListening, lastCommand, transcript, toggleListening, isSupported } = useVoice();
  const [showFeedback, setShowFeedback] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const editorContext = useEditor();

  // Process voice commands
  const processCommand = useCallback((command) => {
    if (!command || command.trim().length === 0) return;
    
    try {
      processVoiceCommand(command, editorContext);
      
      // Add to history
      setCommandHistory(prev => {
        const newHistory = [{ command, timestamp: Date.now() }, ...prev];
        return newHistory.slice(0, 5); // Keep last 5 commands
      });
    } catch (error) {
      console.error('Error processing voice command:', error);
    }
  }, [editorContext]);

  useEffect(() => {
    if (lastCommand && lastCommand.trim().length > 0) {
      // Create a unique key for this command with timestamp
      const commandKey = `${lastCommand}-${Date.now()}`;
      
      setShowFeedback(true);
      processCommand(lastCommand);
      
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastCommand]); // Removed processCommand from dependencies to prevent re-execution

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-panel">
      <button
        className={`voice-toggle ${isListening ? 'active listening' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Stop Voice Control (Click to stop)' : 'Start Voice Control (Click to start)'}
        aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
      >
        <span className="voice-icon">🎤</span>
        {isListening && <span className="pulse-ring"></span>}
      </button>
      
      {isListening && transcript && (
        <div className="voice-transcript">
          <span className="transcript-label">Listening:</span>
          <span className="transcript-text">{transcript}</span>
        </div>
      )}
      
      {showFeedback && lastCommand && (
        <div className="voice-feedback active">
          <span className="feedback-icon">✓</span>
          <span className="feedback-text">{lastCommand}</span>
        </div>
      )}
      
      {isListening && (
        <div className="voice-status">
          <span className="status-indicator"></span>
          <span className="status-text">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
