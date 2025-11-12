import { showToast } from './toast';

export const setupKeyboardShortcuts = (editorContext) => {
  const handleKeyDown = (e) => {
    const { ctrlKey, shiftKey, key, code } = e;

    // Ctrl+S - Save file
    if (ctrlKey && key === 's') {
      e.preventDefault();
      const fileName = editorContext.saveCurrentFile();
      if (fileName) {
        showToast(`Saved ${fileName}`, 'success');
      }
    }

    // Ctrl+N - New file
    else if (ctrlKey && key === 'n') {
      e.preventDefault();
      showToast('Use "create file [name]" voice command', 'info');
    }

    // Ctrl+W - Close tab
    else if (ctrlKey && key === 'w') {
      e.preventDefault();
      if (editorContext.activeTabId) {
        editorContext.closeTab(editorContext.activeTabId);
      }
    }

    // Ctrl+B - Toggle sidebar
    else if (ctrlKey && key === 'b') {
      e.preventDefault();
      editorContext.setSidebarCollapsed(!editorContext.sidebarCollapsed);
      showToast(`Sidebar ${!editorContext.sidebarCollapsed ? 'hidden' : 'shown'}`, 'info');
    }

    // Ctrl+Tab - Next tab
    else if (ctrlKey && key === 'Tab' && !shiftKey) {
      e.preventDefault();
      navigateTabs(1, editorContext);
    }

    // Ctrl+Shift+Tab - Previous tab
    else if (ctrlKey && shiftKey && key === 'Tab') {
      e.preventDefault();
      navigateTabs(-1, editorContext);
    }

    // Ctrl++ - Zoom in
    else if (ctrlKey && (key === '+' || key === '=')) {
      e.preventDefault();
      adjustZoom(1, editorContext);
    }

    // Ctrl+- - Zoom out
    else if (ctrlKey && key === '-') {
      e.preventDefault();
      adjustZoom(-1, editorContext);
    }

    // Ctrl+0 - Reset zoom
    else if (ctrlKey && key === '0') {
      e.preventDefault();
      const newSettings = { ...editorContext.settings, fontSize: 14 };
      editorContext.setSettings(newSettings);
      editorContext.saveSettings(newSettings);
      showToast('Zoom reset', 'info');
    }

    // Ctrl+, - Settings
    else if (ctrlKey && key === ',') {
      e.preventDefault();
      showToast('Opening settings', 'info');
    }

    // F1 - Help
    else if (key === 'F1') {
      e.preventDefault();
      showToast('Opening help', 'info');
    }

    // Ctrl+Shift+P - Command palette
    else if (ctrlKey && shiftKey && key === 'P') {
      e.preventDefault();
      showToast('Opening command palette', 'info');
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

const navigateTabs = (direction, editorContext) => {
  const { openTabs, activeTabId, setActiveTabId } = editorContext;
  
  if (openTabs.length === 0) return;

  const currentIndex = openTabs.findIndex(t => t.id === activeTabId);
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = openTabs.length - 1;
  if (newIndex >= openTabs.length) newIndex = 0;

  setActiveTabId(openTabs[newIndex].id);
  showToast(`Switched to ${openTabs[newIndex].name}`, 'info');
};

const adjustZoom = (delta, editorContext) => {
  const { settings, setSettings, saveSettings } = editorContext;
  const newFontSize = Math.max(10, Math.min(30, settings.fontSize + delta));
  
  const newSettings = { ...settings, fontSize: newFontSize };
  setSettings(newSettings);
  saveSettings(newSettings);
  
  showToast(`Font size: ${newFontSize}px`, 'info');
};
