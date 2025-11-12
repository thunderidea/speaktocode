import { useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { showToast } from '../../utils/toast';

const KeyboardShortcuts = ({ onNewFile, onNewFolder, onSave, onToggleSidebar, onExport, onImport }) => {
  const { settings, setSettings, saveSettings } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N - New File
      if (e.ctrlKey && !e.shiftKey && e.key === 'n') {
        e.preventDefault();
        onNewFile && onNewFile();
        showToast('New File', 'info');
      }

      // Ctrl+Shift+N - New Folder
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        onNewFolder && onNewFolder();
        showToast('New Folder', 'info');
      }

      // Ctrl+S - Save File
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave && onSave();
      }

      // Ctrl+B - Toggle Sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar && onToggleSidebar();
      }

      // Ctrl+E - Export
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        onExport && onExport();
        showToast('Export', 'info');
      }

      // Ctrl+I - Import
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        onImport && onImport();
        showToast('Import', 'info');
      }

      // Ctrl+= - Zoom In
      if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        const newSettings = { ...settings, fontSize: Math.min(settings.fontSize + 1, 30) };
        setSettings(newSettings);
        saveSettings(newSettings);
        showToast(`Font size: ${newSettings.fontSize}px`, 'info');
      }

      // Ctrl+- - Zoom Out
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        const newSettings = { ...settings, fontSize: Math.max(settings.fontSize - 1, 10) };
        setSettings(newSettings);
        saveSettings(newSettings);
        showToast(`Font size: ${newSettings.fontSize}px`, 'info');
      }

      // Ctrl+0 - Reset Zoom
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        const newSettings = { ...settings, fontSize: 14 };
        setSettings(newSettings);
        saveSettings(newSettings);
        showToast('Zoom reset', 'info');
      }

      // Ctrl+, - Open Settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        showToast('Settings (Coming soon)', 'info');
      }

      // F1 - Help
      if (e.key === 'F1') {
        e.preventDefault();
        showToast('Help: Press Ctrl+? for shortcuts', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings, setSettings, saveSettings, onNewFile, onNewFolder, onSave, onToggleSidebar, onExport, onImport]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
