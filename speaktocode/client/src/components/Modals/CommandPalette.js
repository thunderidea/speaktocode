import React, { useState } from 'react';
import { showToast } from '../../utils/toast';
import './CommandPalette.css';

const CommandPalette = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const commands = [
    { name: 'New File', shortcut: 'Ctrl+N', action: 'newFile' },
    { name: 'Save File', shortcut: 'Ctrl+S', action: 'saveFile' },
    { name: 'Close File', shortcut: 'Ctrl+W', action: 'closeFile' },
    { name: 'Find', shortcut: 'Ctrl+F', action: 'find' },
    { name: 'Replace', shortcut: 'Ctrl+H', action: 'replace' },
    { name: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: 'toggleSidebar' },
    { name: 'Toggle Minimap', shortcut: '', action: 'toggleMinimap' },
    { name: 'Zoom In', shortcut: 'Ctrl++', action: 'zoomIn' },
    { name: 'Zoom Out', shortcut: 'Ctrl+-', action: 'zoomOut' },
    { name: 'Settings', shortcut: 'Ctrl+,', action: 'settings' },
    { name: 'Help', shortcut: 'F1', action: 'help' }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommandClick = (action) => {
    showToast(`Executing: ${action}`, 'info');
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content command-palette-content" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="command-search"
          placeholder="Type a command..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <div className="command-list">
          {filteredCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="command-item"
              onClick={() => handleCommandClick(cmd.action)}
            >
              <span className="command-name">{cmd.name}</span>
              {cmd.shortcut && <span className="command-shortcut">{cmd.shortcut}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
