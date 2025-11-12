import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const EditorContext = createContext();

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

export const EditorProvider = ({ children }) => {
  const [fileSystem, setFileSystem] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // For copy/paste and selection
  const [clipboard, setClipboard] = useState(null); // For copy/paste
  const [settings, setSettings] = useState({
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
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load file system
  const loadFileSystem = useCallback(async () => {
    try {
      const response = await axios.get('/api/files');
      setFileSystem(response.data.fileSystem);
    } catch (error) {
      console.error('Load file system error:', error);
    }
  }, []);

  // Save file system
  const saveFileSystem = useCallback(async (newFileSystem) => {
    try {
      await axios.post('/api/files', { fileSystem: newFileSystem });
      setFileSystem(newFileSystem);
    } catch (error) {
      console.error('Save file system error:', error);
    }
  }, []);

  // Load settings
  const loadSettings = useCallback(async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Load settings error:', error);
    }
  }, []);

  // Save settings
  const saveSettings = useCallback(async (newSettings) => {
    try {
      await axios.put('/api/settings', newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Save settings error:', error);
    }
  }, []);

  // Open file
  const openFile = useCallback((path, node) => {
    const existingTab = openTabs.find(tab => tab.path === path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }
    
    const tabId = `tab-${Date.now()}`;
    const newTab = {
      id: tabId,
      path,
      name: node.name,
      language: node.language,
      content: node.content,
      modified: false
    };
    
    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);
  }, [openTabs]);

  // Close tab
  const closeTab = useCallback((tabId) => {
    const tabIndex = openTabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const tab = openTabs[tabIndex];
    if (tab.modified) {
      if (!window.confirm(`${tab.name} has unsaved changes. Close anyway?`)) {
        return;
      }
    }
    
    const newTabs = openTabs.filter(t => t.id !== tabId);
    setOpenTabs(newTabs);
    
    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else {
        setActiveTabId(null);
      }
    }
  }, [openTabs, activeTabId]);

  // Update tab content
  const updateTabContent = useCallback((tabId, content) => {
    setOpenTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, content, modified: true } : tab
    ));
  }, []);

  // Save current file
  const saveCurrentFile = useCallback(() => {
    if (!activeTabId || !fileSystem) return;
    
    const tab = openTabs.find(t => t.id === activeTabId);
    if (!tab) return;
    
    // Update file system
    const pathParts = tab.path.split('.').filter(p => p !== 'children');
    let node = fileSystem;
    
    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        node[part].content = tab.content;
      } else {
        node = node[part].children || node[part];
      }
    });
    
    saveFileSystem(fileSystem);
    
    // Mark tab as saved
    setOpenTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, modified: false } : t
    ));
    
    return tab.name;
  }, [activeTabId, openTabs, fileSystem, saveFileSystem]);

  // Copy item to clipboard
  const copyItem = useCallback((path, node) => {
    setClipboard({ path, node: JSON.parse(JSON.stringify(node)), action: 'copy' });
  }, []);

  // Cut item to clipboard
  const cutItem = useCallback((path, node) => {
    setClipboard({ path, node: JSON.parse(JSON.stringify(node)), action: 'cut' });
  }, []);

  // Paste item from clipboard
  const pasteItem = useCallback((targetPath) => {
    if (!clipboard || !fileSystem) {
      console.log('Paste failed: no clipboard or fileSystem');
      return null;
    }
    
    try {
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      const targetParts = targetPath.split('.').filter(p => p !== 'children');
      let targetNode = newFileSystem;
      
      // Navigate to target
      for (const part of targetParts) {
        if (targetNode[part]) {
          targetNode = targetNode[part];
        } else {
          console.error('Invalid path part:', part);
          return null;
        }
      }
      
      // Ensure target is a folder and has children
      if (targetNode.type !== 'folder') {
        console.error('Target is not a folder');
        return null;
      }
      
      if (!targetNode.children) {
        targetNode.children = {};
      }
      
      // Generate unique name if needed
      let newName = clipboard.node.name;
      let counter = 1;
      while (targetNode.children[newName]) {
        const ext = newName.includes('.') ? '.' + newName.split('.').pop() : '';
        const baseName = ext ? newName.replace(ext, '') : newName;
        newName = `${baseName}_${counter}${ext}`;
        counter++;
      }
      
      // Deep clone the node to paste
      const newNode = JSON.parse(JSON.stringify(clipboard.node));
      newNode.name = newName;
      targetNode.children[newName] = newNode;
      
      // If cut, remove from source
      if (clipboard.action === 'cut') {
        const sourceParts = clipboard.path.split('.').filter(p => p !== 'children');
        let sourceParent = newFileSystem;
        
        // Navigate to source parent
        for (let i = 0; i < sourceParts.length - 1; i++) {
          if (sourceParent[sourceParts[i]]) {
            sourceParent = sourceParent[sourceParts[i]];
            if (sourceParent.children) {
              sourceParent = sourceParent.children;
            }
          }
        }
        
        // Delete from source
        const sourceName = sourceParts[sourceParts.length - 1];
        delete sourceParent[sourceName];
        setClipboard(null);
      }
      
      saveFileSystem(newFileSystem);
      return newName;
    } catch (error) {
      console.error('Paste error:', error);
      return null;
    }
  }, [clipboard, fileSystem, saveFileSystem, setClipboard]);

  const value = {
    fileSystem,
    setFileSystem,
    openTabs,
    setOpenTabs,
    activeTabId,
    setActiveTabId,
    selectedItem,
    setSelectedItem,
    clipboard,
    setClipboard,
    settings,
    setSettings,
    sidebarCollapsed,
    setSidebarCollapsed,
    loadFileSystem,
    saveFileSystem,
    loadSettings,
    saveSettings,
    openFile,
    closeTab,
    updateTabContent,
    saveCurrentFile,
    copyItem,
    cutItem,
    pasteItem
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
