import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { showToast } from '../../utils/toast';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
  const { settings, setSettings, saveSettings } = useEditor();
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSettings(localSettings);
    await saveSettings(localSettings);
    
    // Apply theme
    if (localSettings.theme === 'light') {
      document.body.className = 'light-theme';
    } else if (localSettings.theme === 'high-contrast') {
      document.body.className = 'high-contrast-theme';
    } else {
      document.body.className = '';
    }
    
    showToast('Settings saved successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 14,
      fontFamily: 'Consolas',
      tabSize: 2,
      lineHeight: 1.5,
      cursorStyle: 'line',
      wordWrap: true,
      lineNumbers: true,
      minimapEnabled: true,
      autoSave: false,
      autoSaveInterval: 5000,
      formatOnSave: false,
      autoCloseBrackets: true,
      voiceLanguage: 'en-US',
      voiceSensitivity: 0.7,
      continuousListening: true,
      voiceFeedback: true,
      sortBy: 'name',
      showHiddenFiles: false,
      compactFolders: false,
      confirmBeforeDelete: true,
      autoReveal: true,
      smoothScroll: true
    };
    setLocalSettings(defaultSettings);
    showToast('Settings reset to defaults', 'info');
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content settings-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-body">
          {/* Appearance Settings */}
          <div className="settings-category">
            <h4>🎨 Appearance</h4>
            <div className="setting-group">
              <label>Theme</label>
              <select
                className="form-control"
                value={localSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Font Family</label>
              <select
                className="form-control"
                value={localSettings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              >
                <option value="Consolas">Consolas</option>
                <option value="Monaco">Monaco</option>
                <option value="Courier New">Courier New</option>
                <option value="Fira Code">Fira Code</option>
                <option value="Source Code Pro">Source Code Pro</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Font Size: <span>{localSettings.fontSize}</span>px</label>
              <input
                type="range"
                min="10"
                max="30"
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              />
            </div>
            <div className="settings-row">
              <label>Line Height: <span>{localSettings.lineHeight}</span></label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={localSettings.lineHeight}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              />
            </div>
            <div className="setting-group">
              <label>Cursor Style</label>
              <select
                className="form-control"
                value={localSettings.cursorStyle}
                onChange={(e) => handleChange('cursorStyle', e.target.value)}
              >
                <option value="line">Line</option>
                <option value="block">Block</option>
                <option value="underline">Underline</option>
              </select>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="settings-category">
            <h4>✏️ Editor</h4>
            <div className="settings-row">
              <label>Tab Size: <span>{localSettings.tabSize}</span></label>
              <input
                type="range"
                min="2"
                max="8"
                value={localSettings.tabSize}
                onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              />
            </div>
            <div className="settings-row">
              <label>Word Wrap</label>
              <input
                type="checkbox"
                checked={localSettings.wordWrap}
                onChange={(e) => handleChange('wordWrap', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Line Numbers</label>
              <input
                type="checkbox"
                checked={localSettings.lineNumbers}
                onChange={(e) => handleChange('lineNumbers', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Minimap</label>
              <input
                type="checkbox"
                checked={localSettings.minimapEnabled}
                onChange={(e) => handleChange('minimapEnabled', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Auto-Save</label>
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
              />
            </div>
            <div className="setting-group">
              <label>Auto-Save Interval</label>
              <select
                className="form-control"
                value={localSettings.autoSaveInterval}
                onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value))}
              >
                <option value="1000">1 second</option>
                <option value="5000">5 seconds</option>
                <option value="10000">10 seconds</option>
                <option value="30000">30 seconds</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Format on Save</label>
              <input
                type="checkbox"
                checked={localSettings.formatOnSave}
                onChange={(e) => handleChange('formatOnSave', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Auto Close Brackets</label>
              <input
                type="checkbox"
                checked={localSettings.autoCloseBrackets}
                onChange={(e) => handleChange('autoCloseBrackets', e.target.checked)}
              />
            </div>
          </div>

          {/* Voice Settings */}
          <div className="settings-category">
            <h4>🎤 Voice Control</h4>
            <div className="setting-group">
              <label>Voice Language</label>
              <select
                className="form-control"
                value={localSettings.voiceLanguage}
                onChange={(e) => handleChange('voiceLanguage', e.target.value)}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="hi-IN">Hindi (हिंदी)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Voice Sensitivity: <span>{localSettings.voiceSensitivity}</span></label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.voiceSensitivity}
                onChange={(e) => handleChange('voiceSensitivity', parseFloat(e.target.value))}
              />
            </div>
            <div className="settings-row">
              <label>Continuous Listening</label>
              <input
                type="checkbox"
                checked={localSettings.continuousListening}
                onChange={(e) => handleChange('continuousListening', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Voice Feedback</label>
              <input
                type="checkbox"
                checked={localSettings.voiceFeedback}
                onChange={(e) => handleChange('voiceFeedback', e.target.checked)}
              />
            </div>
          </div>

          {/* File Explorer Settings */}
          <div className="settings-category">
            <h4>📁 File Explorer</h4>
            <div className="setting-group">
              <label>Sort By</label>
              <select
                className="form-control"
                value={localSettings.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="date">Date Modified</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Show Hidden Files</label>
              <input
                type="checkbox"
                checked={localSettings.showHiddenFiles}
                onChange={(e) => handleChange('showHiddenFiles', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Compact Folders</label>
              <input
                type="checkbox"
                checked={localSettings.compactFolders}
                onChange={(e) => handleChange('compactFolders', e.target.checked)}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="settings-category">
            <h4>⚙️ Advanced</h4>
            <div className="settings-row">
              <label>Confirm Before Delete</label>
              <input
                type="checkbox"
                checked={localSettings.confirmBeforeDelete}
                onChange={(e) => handleChange('confirmBeforeDelete', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Auto-Reveal in Explorer</label>
              <input
                type="checkbox"
                checked={localSettings.autoReveal}
                onChange={(e) => handleChange('autoReveal', e.target.checked)}
              />
            </div>
            <div className="settings-row">
              <label>Smooth Scrolling</label>
              <input
                type="checkbox"
                checked={localSettings.smoothScroll}
                onChange={(e) => handleChange('smoothScroll', e.target.checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
            <button className="btn btn-secondary" onClick={handleReset}>Reset to Defaults</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
