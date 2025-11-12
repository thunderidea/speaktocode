import React, { useState } from 'react';
import './HelpModal.css';

const HelpModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('shortcuts');
  const [searchQuery, setSearchQuery] = useState('');

  const keyboardShortcuts = [
    {
      category: 'File Operations',
      items: [
        { action: 'New File', key: 'Ctrl+N' },
        { action: 'Save File', key: 'Ctrl+S' },
        { action: 'Close Tab', key: 'Ctrl+W' },
        { action: 'Open File', key: 'Ctrl+O' }
      ]
    },
    {
      category: 'Editing',
      items: [
        { action: 'Undo', key: 'Ctrl+Z' },
        { action: 'Redo', key: 'Ctrl+Y' },
        { action: 'Copy', key: 'Ctrl+C' },
        { action: 'Cut', key: 'Ctrl+X' },
        { action: 'Paste', key: 'Ctrl+V' },
        { action: 'Select All', key: 'Ctrl+A' },
        { action: 'Find', key: 'Ctrl+F' },
        { action: 'Replace', key: 'Ctrl+H' },
        { action: 'Comment Line', key: 'Ctrl+/' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { action: 'Go to Line', key: 'Ctrl+G' },
        { action: 'Next Tab', key: 'Ctrl+Tab' },
        { action: 'Previous Tab', key: 'Ctrl+Shift+Tab' },
        { action: 'Quick Open', key: 'Ctrl+P' }
      ]
    },
    {
      category: 'View',
      items: [
        { action: 'Toggle Sidebar', key: 'Ctrl+B' },
        { action: 'Split Editor', key: 'Ctrl+\\' },
        { action: 'Zoom In', key: 'Ctrl++' },
        { action: 'Zoom Out', key: 'Ctrl+-' },
        { action: 'Reset Zoom', key: 'Ctrl+0' }
      ]
    },
    {
      category: 'Other',
      items: [
        { action: 'Command Palette', key: 'Ctrl+Shift+P' },
        { action: 'Toggle Voice', key: 'Ctrl+Shift+V' },
        { action: 'Settings', key: 'Ctrl+,' }
      ]
    }
  ];

  const voiceCommands = [
    {
      category: 'File Operations',
      commands: [
        'create file [name]', 'create folder [name]', 'delete file', 'rename file',
        'save file', 'download file', 'close file', 'new file', 'new folder'
      ]
    },
    {
      category: 'Navigation',
      commands: [
        'go to line [number]', 'next tab', 'previous tab', 'close tab',
        'first tab', 'last tab', 'open file [name]'
      ]
    },
    {
      category: 'Editing',
      commands: [
        'select all', 'copy', 'paste', 'cut', 'undo', 'redo',
        'format code', 'comment line', 'uncomment line', 'duplicate line',
        'delete line', 'move line up', 'move line down'
      ]
    },
    {
      category: 'Search & Replace',
      commands: [
        'find', 'find [text]', 'replace', 'find next', 'find previous'
      ]
    },
    {
      category: 'Layout & View',
      commands: [
        'toggle sidebar', 'split editor', 'close split',
        'zoom in', 'zoom out', 'reset zoom', 'toggle minimap',
        'full screen', 'toggle terminal'
      ]
    },
    {
      category: 'Theme & Appearance',
      commands: [
        'dark mode', 'light mode', 'high contrast mode',
        'increase font size', 'decrease font size'
      ]
    },
    {
      category: 'Project Management',
      commands: [
        'import project', 'export project', 'save all', 'close all tabs'
      ]
    },
    {
      category: 'Voice Control',
      commands: [
        'stop listening', 'start listening', 'help', 'open settings',
        'open command palette', 'show shortcuts'
      ]
    }
  ];

  const gestures = [
    { name: 'Two-finger scroll', description: 'Scroll editor content vertically and horizontally' },
    { name: 'Pinch to zoom', description: 'Zoom in/out on the editor content' },
    { name: 'Three-finger swipe left', description: 'Switch to previous tab' },
    { name: 'Three-finger swipe right', description: 'Switch to next tab' },
    { name: 'Two-finger tap', description: 'Show context menu at cursor' },
    { name: 'Four-finger swipe up', description: 'Show all open tabs' },
    { name: 'Four-finger swipe down', description: 'Hide sidebar' }
  ];

  const filterCommands = (commands, query) => {
    if (!query) return commands;
    return commands.filter(cmd => cmd.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content help-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Help & Documentation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="help-tabs">
          <button
            className={`help-tab ${activeTab === 'shortcuts' ? 'active' : ''}`}
            onClick={() => setActiveTab('shortcuts')}
          >
            Keyboard Shortcuts
          </button>
          <button
            className={`help-tab ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            Voice Commands (200+)
          </button>
          <button
            className={`help-tab ${activeTab === 'gestures' ? 'active' : ''}`}
            onClick={() => setActiveTab('gestures')}
          >
            Touchpad Gestures
          </button>
        </div>

        <div className="help-content-area">
          {activeTab === 'shortcuts' && (
            <>
              {keyboardShortcuts.map((section, idx) => (
                <div key={idx} className="help-section">
                  <h3>{section.category}</h3>
                  <div className="shortcut-list">
                    {section.items.map((item, i) => (
                      <div key={i} className="shortcut-item">
                        <span className="shortcut-action">{item.action}</span>
                        <span className="shortcut-key">{item.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'voice' && (
            <>
              <input
                type="text"
                className="help-search"
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {voiceCommands.map((section, idx) => {
                const filteredCommands = filterCommands(section.commands, searchQuery);
                if (filteredCommands.length === 0) return null;
                
                return (
                  <div key={idx} className="help-section">
                    <h3>{section.category}</h3>
                    <div className="command-list">
                      {filteredCommands.map((cmd, i) => (
                        <div key={i} className="command-item-help">
                          <span className="command-name-help">"{cmd}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === 'gestures' && (
            <div className="help-section">
              <h3>Touchpad Gestures</h3>
              <p style={{ marginBottom: '20px', opacity: 0.8 }}>
                Use these gestures on your laptop touchpad for quick navigation:
              </p>
              <div className="gesture-list">
                {gestures.map((gesture, idx) => (
                  <div key={idx} className="gesture-item">
                    <span className="gesture-name">{gesture.name}</span>
                    <span className="gesture-description">{gesture.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
