import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEditor } from '../../context/EditorContext';
import MenuBar from '../MenuBar/MenuBar';
import FileExplorer from '../FileExplorer/FileExplorer';
import EditorArea from './EditorArea';
import StatusBar from '../StatusBar/StatusBar';
import VoiceControl from '../VoiceControl/VoiceControl';
import Toast from '../Toast/Toast';
import KeyboardShortcuts from '../KeyboardShortcuts/KeyboardShortcuts';
import ImportExportModal from '../Modals/ImportExportModal';
import './EditorScreen.css';

const EditorScreen = () => {
  const { user } = useAuth();
  const { loadFileSystem, loadSettings, saveCurrentFile, sidebarCollapsed, setSidebarCollapsed } = useEditor();
  const [showImportExport, setShowImportExport] = useState(false);

  useEffect(() => {
    if (user) {
      loadFileSystem();
      loadSettings();
    }
  }, [user, loadFileSystem, loadSettings]);

  const handleNewFile = () => {
    // This will be handled by FileExplorer
    document.querySelector('.sidebar-actions button[title*="New File"]')?.click();
  };

  const handleNewFolder = () => {
    // This will be handled by FileExplorer
    document.querySelector('.sidebar-actions button[title*="New Folder"]')?.click();
  };

  const handleSave = () => {
    saveCurrentFile();
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleExport = () => {
    setShowImportExport(true);
  };

  const handleImport = () => {
    setShowImportExport(true);
  };

  return (
    <div className="editor-screen">
      <MenuBar onImportExport={() => setShowImportExport(true)} />
      <div className="main-content">
        <FileExplorer />
        <EditorArea />
      </div>
      <StatusBar />
      <VoiceControl />
      <Toast />
      <KeyboardShortcuts
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onSave={handleSave}
        onToggleSidebar={handleToggleSidebar}
        onExport={handleExport}
        onImport={handleImport}
      />
      {showImportExport && (
        <ImportExportModal onClose={() => setShowImportExport(false)} />
      )}
    </div>
  );
};

export default EditorScreen;
