import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEditor } from '../../context/EditorContext';
import { useVoice } from '../../context/VoiceContext';
import SettingsModal from '../Modals/SettingsModal';
import HelpModal from '../Modals/HelpModal';
import CommandPalette from '../Modals/CommandPalette';
import { showToast } from '../../utils/toast';
import './MenuBar.css';

const MenuBar = ({ onImportExport }) => {
  const { user, logout } = useAuth();
  const { saveCurrentFile, openTabs, closeTab, fileSystem } = useEditor();
  const { toggleListening, isListening } = useVoice();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [localSaveEnabled, setLocalSaveEnabled] = useState(false);
  const [localDirectoryHandle, setLocalDirectoryHandle] = useState(null);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
  };

  // Auto-save to local when fileSystem changes
  useEffect(() => {
    if (localSaveEnabled && localDirectoryHandle && fileSystem) {
      const autoSave = async () => {
        try {
          await saveProjectToLocal(localDirectoryHandle, fileSystem);
          console.log('Auto-saved to local directory');
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      };

      // Debounce auto-save
      const timeoutId = setTimeout(autoSave, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [fileSystem, localSaveEnabled, localDirectoryHandle]);

  const handleMenuAction = (action) => {
    closeAllMenus();
    
    switch(action) {
      case 'newFile':
        // Will be handled by voice or keyboard
        showToast('Use "create file [name]" voice command or Ctrl+N', 'info');
        break;
      case 'newFolder':
        showToast('Use "create folder [name]" voice command', 'info');
        break;
      case 'saveFile':
        const fileName = saveCurrentFile();
        if (fileName) {
          showToast(`Saved ${fileName}`, 'success');
        }
        break;
      case 'saveToLocal':
        handleSaveToLocal();
        break;
      case 'enableAutoSave':
        handleEnableAutoSave();
        break;
      case 'closeFile':
        if (openTabs.length > 0) {
          closeTab(openTabs[0].id);
        }
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'help':
        setShowHelp(true);
        break;
      case 'commandPalette':
        setShowCommandPalette(true);
        break;
      case 'toggleSidebar':
        // Will be handled by EditorContext
        showToast('Sidebar toggled', 'info');
        break;
      default:
        break;
    }
  };

  const handleSaveToLocal = async () => {
    try {
      if (!window.showDirectoryPicker) {
        showToast('File System Access API not supported in this browser. Use Chrome/Edge.', 'error');
        return;
      }

      const dirHandle = await window.showDirectoryPicker();
      setLocalDirectoryHandle(dirHandle);
      
      await saveProjectToLocal(dirHandle, fileSystem);
      showToast('Project saved to local directory!', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Save to local error:', error);
        showToast('Failed to save to local directory', 'error');
      }
    }
  };

  const handleEnableAutoSave = async () => {
    try {
      if (!window.showDirectoryPicker) {
        showToast('File System Access API not supported in this browser. Use Chrome/Edge.', 'error');
        return;
      }

      const dirHandle = await window.showDirectoryPicker();
      setLocalDirectoryHandle(dirHandle);
      setLocalSaveEnabled(true);
      
      await saveProjectToLocal(dirHandle, fileSystem);
      showToast('Auto-save to local enabled! Files will save automatically.', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Enable auto-save error:', error);
        showToast('Failed to enable auto-save', 'error');
      }
    }
  };

  const saveProjectToLocal = async (dirHandle, fileSystem) => {
    if (!fileSystem) return;

    const saveNode = async (node, parentHandle) => {
      if (node.type === 'file') {
        const fileHandle = await parentHandle.getFileHandle(node.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(node.content || '');
        await writable.close();
      } else if (node.type === 'folder' && node.children) {
        const folderHandle = await parentHandle.getDirectoryHandle(node.name, { create: true });
        for (const key in node.children) {
          await saveNode(node.children[key], folderHandle);
        }
      }
    };

    // Save all roots or root
    if (fileSystem.roots) {
      for (const key in fileSystem.roots) {
        await saveNode(fileSystem.roots[key], dirHandle);
      }
    } else if (fileSystem.root) {
      await saveNode(fileSystem.root, dirHandle);
    }
  };

  const handleImport = () => {
    closeAllMenus();
    onImportExport && onImportExport();
  };

  const handleExport = () => {
    closeAllMenus();
    onImportExport && onImportExport();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      showToast('Logged out successfully', 'info');
    }
  };

  return (
    <>
      <div className="menu-bar">
        <div className="menu-items">
          <div className="menu-item" onClick={() => toggleMenu('file')}>
            File
            <div className={`dropdown-menu ${activeMenu === 'file' ? 'active' : ''}`}>
              <div className="menu-option" onClick={() => handleMenuAction('newFile')}>
                New File <span>Ctrl+N</span>
              </div>
              <div className="menu-option" onClick={() => handleMenuAction('newFolder')}>
                New Folder
              </div>
              <div className="menu-option" onClick={() => handleMenuAction('saveFile')}>
                Save <span>Ctrl+S</span>
              </div>
              <div className="menu-divider"></div>
              <div className="menu-option" onClick={() => handleMenuAction('saveToLocal')}>
                💾 Save to Local Folder
              </div>
              <div className="menu-option" onClick={() => handleMenuAction('enableAutoSave')}>
                🔄 Enable Auto-Save to Local
              </div>
              {localSaveEnabled && (
                <div className="menu-option" style={{ color: '#4caf50', fontSize: '12px' }}>
                  ✓ Auto-save enabled
                </div>
              )}
              <div className="menu-divider"></div>
              <div className="menu-option" onClick={() => handleMenuAction('closeFile')}>
                Close File
              </div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('edit')}>
            Edit
            <div className={`dropdown-menu ${activeMenu === 'edit' ? 'active' : ''}`}>
              <div className="menu-option">Undo <span>Ctrl+Z</span></div>
              <div className="menu-option">Redo <span>Ctrl+Y</span></div>
              <div className="menu-option">Find <span>Ctrl+F</span></div>
              <div className="menu-option">Replace <span>Ctrl+H</span></div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('selection')}>
            Selection
            <div className={`dropdown-menu ${activeMenu === 'selection' ? 'active' : ''}`}>
              <div className="menu-option">Select All <span>Ctrl+A</span></div>
              <div className="menu-option">Copy <span>Ctrl+C</span></div>
              <div className="menu-option">Cut <span>Ctrl+X</span></div>
              <div className="menu-option">Paste <span>Ctrl+V</span></div>
            </div>
          </div>

          <div className="menu-item" onClick={() => toggleMenu('view')}>
            View
            <div className={`dropdown-menu ${activeMenu === 'view' ? 'active' : ''}`}>
              <div className="menu-option" onClick={() => handleMenuAction('toggleSidebar')}>
                Toggle Sidebar <span>Ctrl+B</span>
              </div>
              <div className="menu-option">Toggle Minimap</div>
              <div className="menu-option">Zoom In <span>Ctrl++</span></div>
              <div className="menu-option">Zoom Out <span>Ctrl+-</span></div>
            </div>
          </div>

          <div className="menu-item" onClick={() => handleMenuAction('help')}>
            Help
          </div>

          <div className="menu-item" onClick={() => toggleMenu('settings')}>
            Settings
            <div className={`dropdown-menu ${activeMenu === 'settings' ? 'active' : ''}`}>
              <div className="menu-option" onClick={() => handleMenuAction('settings')}>
                Preferences
              </div>
              <div className="menu-option" onClick={() => handleMenuAction('commandPalette')}>
                Command Palette <span>Ctrl+Shift+P</span>
              </div>
            </div>
          </div>
        </div>

        <div className="menu-right">
          <button className="btn btn-sm" onClick={handleImport} title="Import Project">
            📥 Import
          </button>
          <button className="btn btn-sm" onClick={handleExport} title="Export Project">
            📤 Export
          </button>
          <button 
            className={`btn btn-sm ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            title="Toggle Voice Control"
          >
            🎤 Voice
          </button>
          <div className="user-info">
            <span>{user?.email}</span>
            <button className="btn btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showCommandPalette && <CommandPalette onClose={() => setShowCommandPalette(false)} />}
    </>
  );
};

export default MenuBar;
