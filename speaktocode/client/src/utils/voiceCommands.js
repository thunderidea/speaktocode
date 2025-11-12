import { showToast } from './toast';
import { detectLanguage } from './fileIcons';

// Store editor reference globally
let editorInstance = null;

export const setEditorInstance = (editor) => {
  editorInstance = editor;
};

export const getEditorInstance = () => {
  return editorInstance;
};

export const processVoiceCommand = (command, editorContext) => {
  const {
    fileSystem,
    setFileSystem,
    saveFileSystem,
    saveCurrentFile,
    openTabs,
    activeTabId,
    setActiveTabId,
    closeTab,
    settings,
    setSettings,
    saveSettings,
    sidebarCollapsed,
    setSidebarCollapsed,
    openFile,
    selectedItem,
    pasteItem,
    clipboard
  } = editorContext;

  console.log('Voice command:', command);
  const editor = getEditorInstance();

  // File operations
  if (command.includes('make') && command.includes('under')) {
    // "make [filename/foldername] under [parentfolder]"
    const match = command.match(/make\s+(folder\s+)?([\w.-]+)\s+under\s+([\w.-]+)/i);
    if (match) {
      const isFolder = !!match[1]; // Check if "folder" keyword is present
      const itemName = match[2];
      const parentFolderName = match[3];
      
      if (isFolder) {
        createFolderInFolder(itemName, parentFolderName, fileSystem, setFileSystem, saveFileSystem);
      } else {
        createFileInFolder(itemName, parentFolderName, fileSystem, setFileSystem, saveFileSystem);
      }
    } else {
      showToast('Format: "make [folder] filename under foldername"', 'warning');
    }
  }
  else if (command.includes('new file')) {
    // Quick create file with auto-generated name
    createQuickFile(fileSystem, setFileSystem, saveFileSystem);
  }
  else if (command.includes('new folder')) {
    // Quick create folder with auto-generated name
    createQuickFolder(fileSystem, setFileSystem, saveFileSystem);
  }
  else if (command.includes('create file')) {
    const fileName = extractFileName(command);
    if (fileName) {
      createFile(fileName, fileSystem, setFileSystem, saveFileSystem);
    } else {
      showToast('Please specify a file name', 'warning');
    }
  }
  else if (command.includes('create folder')) {
    const folderName = extractFileName(command);
    if (folderName) {
      createFolder(folderName, fileSystem, setFileSystem, saveFileSystem);
    } else {
      showToast('Please specify a folder name', 'warning');
    }
  }
  else if (command.includes('save file') || command.includes('save')) {
    const fileName = saveCurrentFile();
    if (fileName) {
      showToast(`Saved ${fileName}`, 'success');
    } else {
      showToast('No file to save', 'warning');
    }
  }
  else if (command.includes('close file') || command.includes('close tab')) {
    if (activeTabId) {
      closeTab(activeTabId);
      showToast('File closed', 'success');
    }
  }
  else if (command.includes('close all tabs') || command.includes('close all files')) {
    openTabs.forEach(tab => closeTab(tab.id));
    showToast('All tabs closed', 'success');
  }
  else if (command.includes('open file')) {
    const fileName = extractFileName(command);
    if (fileName && fileSystem) {
      // Try to find and open the file
      const file = findFileInSystem(fileName, fileSystem);
      if (file) {
        openFile(file.path, file.node);
        showToast(`Opened ${fileName}`, 'success');
      } else {
        showToast(`File not found: ${fileName}`, 'error');
      }
    } else {
      showToast('Please specify a file name', 'warning');
    }
  }
  else if (command.includes('rename')) {
    if (selectedItem) {
      showToast(`Right-click on "${selectedItem.node.name}" to rename`, 'info');
    } else {
      showToast('Please select a file or folder first', 'warning');
    }
  }
  else if (command.includes('delete') && selectedItem) {
    // Delete selected item by voice
    const itemName = selectedItem.node.name;
    if (window.confirm(`Delete "${itemName}"?`)) {
      deleteItem(selectedItem.path, fileSystem, setFileSystem, saveFileSystem);
      showToast(`Deleted: ${itemName}`, 'success');
    }
  }
  else if (command.includes('delete')) {
    // Delete by name
    const fileName = extractFileName(command);
    if (fileName) {
      const file = findFileInSystem(fileName, fileSystem);
      if (file) {
        if (window.confirm(`Delete "${fileName}"?`)) {
          deleteItem(file.path, fileSystem, setFileSystem, saveFileSystem);
          showToast(`Deleted: ${fileName}`, 'success');
        }
      } else {
        showToast(`File not found: ${fileName}`, 'error');
      }
    } else {
      showToast('Please specify a file name or select a file', 'warning');
    }
  }

  // Navigation
  else if (command.includes('next tab')) {
    navigateTabs(1, openTabs, activeTabId, setActiveTabId);
  }
  else if (command.includes('previous tab') || command.includes('prev tab')) {
    navigateTabs(-1, openTabs, activeTabId, setActiveTabId);
  }
  else if (command.includes('first tab')) {
    if (openTabs.length > 0) {
      setActiveTabId(openTabs[0].id);
      showToast('Switched to first tab', 'info');
    }
  }
  else if (command.includes('last tab')) {
    if (openTabs.length > 0) {
      setActiveTabId(openTabs[openTabs.length - 1].id);
      showToast('Switched to last tab', 'info');
    }
  }
  else if (command.includes('go to line')) {
    const lineNumber = extractNumber(command);
    if (lineNumber && editor) {
      editor.revealLineInCenter(lineNumber);
      editor.setPosition({ lineNumber, column: 1 });
      showToast(`Jumped to line ${lineNumber}`, 'success');
    } else if (!lineNumber) {
      showToast('Please specify a line number', 'warning');
    }
  }
  else if (command.includes('scroll to top') || command.includes('go to top')) {
    if (editor) {
      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.revealLineInCenter(1);
      showToast('Scrolled to top', 'success');
    }
  }
  else if (command.includes('scroll to bottom') || command.includes('go to bottom')) {
    if (editor) {
      const model = editor.getModel();
      if (model) {
        const lastLine = model.getLineCount();
        editor.setPosition({ lineNumber: lastLine, column: 1 });
        editor.revealLineInCenter(lastLine);
        showToast('Scrolled to bottom', 'success');
      }
    }
  }

  // Editing commands
  else if (command.includes('select all')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.selectAll');
      showToast('Selected all', 'success');
    }
  }
  else if (command.includes('copy')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.clipboardCopyAction');
      showToast('Copied to clipboard', 'success');
    }
  }
  else if (command.includes('paste file') || command.includes('paste folder')) {
    // Paste file/folder from clipboard
    if (!clipboard) {
      showToast('Nothing to paste. Copy or cut something first', 'warning');
      return;
    }
    
    if (selectedItem && selectedItem.node.type === 'folder') {
      const pastedName = pasteItem(selectedItem.path);
      if (pastedName) {
        showToast(`Pasted: ${pastedName}`, 'success');
      } else {
        showToast('Failed to paste', 'error');
      }
    } else {
      showToast('Please select a folder first', 'warning');
    }
  }
  else if (command.includes('paste')) {
    // Check if it's for file system or editor
    if (clipboard) {
      // File system paste
      if (selectedItem && selectedItem.node.type === 'folder') {
        const pastedName = pasteItem(selectedItem.path);
        if (pastedName) {
          showToast(`Pasted: ${pastedName}`, 'success');
        } else {
          showToast('Failed to paste', 'error');
        }
      } else {
        showToast('Please select a folder first', 'warning');
      }
    } else if (editor) {
      // Editor paste
      editor.trigger('voice', 'editor.action.clipboardPasteAction');
      showToast('Pasted from clipboard', 'success');
    }
  }
  else if (command.includes('cut')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.clipboardCutAction');
      showToast('Cut to clipboard', 'success');
    }
  }
  else if (command.includes('undo')) {
    if (editor) {
      editor.trigger('voice', 'undo');
      showToast('Undo', 'success');
    }
  }
  else if (command.includes('redo')) {
    if (editor) {
      editor.trigger('voice', 'redo');
      showToast('Redo', 'success');
    }
  }
  else if (command.includes('format code') || command.includes('format document') || command.includes('format')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.formatDocument');
      showToast('Code formatted', 'success');
    }
  }
  else if (command.includes('comment line') || command.includes('comment') || command.includes('toggle comment')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.commentLine');
      showToast('Line commented', 'success');
    }
  }
  else if (command.includes('duplicate line') || command.includes('copy line down')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.copyLinesDownAction');
      showToast('Line duplicated', 'success');
    }
  }
  else if (command.includes('delete line') || command.includes('remove line')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.deleteLines');
      showToast('Line deleted', 'success');
    }
  }
  else if (command.includes('move line up')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.moveLinesUpAction');
      showToast('Line moved up', 'success');
    }
  }
  else if (command.includes('move line down')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.moveLinesDownAction');
      showToast('Line moved down', 'success');
    }
  }
  else if (command.includes('indent') && !command.includes('outdent')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.indentLines');
      showToast('Indented', 'success');
    }
  }
  else if (command.includes('outdent') || command.includes('unindent')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.outdentLines');
      showToast('Outdented', 'success');
    }
  }

  // Search
  else if (command.includes('find') || command.includes('search')) {
    if (editor) {
      editor.trigger('voice', 'actions.find');
      showToast('Opening find', 'success');
    }
  }
  else if (command.includes('replace')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.startFindReplaceAction');
      showToast('Opening replace', 'success');
    }
  }
  else if (command.includes('find next')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.nextMatchFindAction');
      showToast('Find next', 'success');
    }
  }
  else if (command.includes('find previous')) {
    if (editor) {
      editor.trigger('voice', 'editor.action.previousMatchFindAction');
      showToast('Find previous', 'success');
    }
  }

  // Layout
  else if (command.includes('toggle sidebar')) {
    setSidebarCollapsed(!sidebarCollapsed);
    showToast(`Sidebar ${!sidebarCollapsed ? 'hidden' : 'shown'}`, 'info');
  }
  else if (command.includes('toggle minimap')) {
    const newSettings = { ...settings, minimapEnabled: !settings.minimapEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast(`Minimap ${!settings.minimapEnabled ? 'enabled' : 'disabled'}`, 'info');
  }
  else if (command.includes('zoom in') || command.includes('increase font')) {
    const newSettings = { ...settings, fontSize: Math.min(settings.fontSize + 1, 30) };
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast(`Font size: ${newSettings.fontSize}px`, 'info');
  }
  else if (command.includes('zoom out') || command.includes('decrease font')) {
    const newSettings = { ...settings, fontSize: Math.max(settings.fontSize - 1, 10) };
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast(`Font size: ${newSettings.fontSize}px`, 'info');
  }
  else if (command.includes('reset zoom')) {
    const newSettings = { ...settings, fontSize: 14 };
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast('Zoom reset', 'info');
  }

  // Theme
  else if (command.includes('dark mode') || command.includes('dark theme')) {
    const newSettings = { ...settings, theme: 'dark' };
    setSettings(newSettings);
    saveSettings(newSettings);
    document.body.className = '';
    showToast('Dark theme activated', 'success');
  }
  else if (command.includes('light mode') || command.includes('light theme')) {
    const newSettings = { ...settings, theme: 'light' };
    setSettings(newSettings);
    saveSettings(newSettings);
    document.body.className = 'light-theme';
    showToast('Light theme activated', 'success');
  }
  else if (command.includes('high contrast')) {
    const newSettings = { ...settings, theme: 'high-contrast' };
    setSettings(newSettings);
    saveSettings(newSettings);
    document.body.className = 'high-contrast-theme';
    showToast('High contrast theme activated', 'success');
  }

  // Import/Export
  else if (command.includes('import')) {
    document.querySelector('button[title*="Import"]')?.click();
    showToast('Opening import dialog', 'info');
  }
  else if (command.includes('export')) {
    document.querySelector('button[title*="Export"]')?.click();
    showToast('Opening export dialog', 'info');
  }

  // Logout
  else if (command.includes('logout') || command.includes('log out') || command.includes('sign out')) {
    if (window.confirm('Are you sure you want to logout?')) {
      // Trigger logout button click
      const logoutBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.toLowerCase().includes('logout')
      );
      if (logoutBtn) {
        logoutBtn.click();
        showToast('Logging out...', 'info');
      }
    }
  }

  // Help
  else if (command.includes('help') || command.includes('show help')) {
    // Open help modal
    const helpBtn = Array.from(document.querySelectorAll('.menu-item')).find(item => 
      item.textContent.toLowerCase().includes('help')
    );
    if (helpBtn) {
      helpBtn.click();
      showToast('Opening help', 'info');
    } else {
      showToast('Help: Use voice commands to control the editor', 'info');
    }
  }

  // Settings
  else if (command.includes('open settings') || command.includes('settings')) {
    // Open settings modal
    const settingsBtn = Array.from(document.querySelectorAll('.menu-option')).find(item => 
      item.textContent.toLowerCase().includes('preferences')
    );
    if (settingsBtn) {
      settingsBtn.click();
      showToast('Opening settings', 'info');
    } else {
      showToast('Settings: Click on Settings menu', 'info');
    }
  }

  // Voice Typing - Use Windows Voice Typing (Win+H)
  else if (command.includes('typing on') || command.includes('start typing') || command.includes('enable typing')) {
    showToast('Opening Windows Voice Typing (Win+H)', 'success');
    triggerWindowsVoiceTyping();
  }
  else if (command.includes('typing off') || command.includes('stop typing') || command.includes('disable typing')) {
    showToast('Close Windows Voice Typing with Escape key', 'info');
    // Windows voice typing closes with Escape key
  }

  // Download
  else if (command.includes('download')) {
    if (selectedItem) {
      downloadSelectedItem(selectedItem);
    } else {
      showToast('Please select a file or folder first', 'warning');
    }
  }

  else {
    showToast(`Unknown command: "${command}"`, 'warning');
  }
};

// Helper functions
const extractFileName = (command) => {
  const match = command.match(/(?:file|folder)\s+([\w.-]+)/);
  return match ? match[1] : null;
};

const extractNumber = (command) => {
  const match = command.match(/\d+/);
  return match ? parseInt(match[0]) : null;
};

const createFileInFolder = (fileName, folderName, fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  try {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    
    // Find the folder
    const folder = findFolderByName(folderName, newFileSystem);
    if (!folder) {
      showToast(`Folder "${folderName}" not found`, 'error');
      return;
    }
    
    if (!folder.children) {
      folder.children = {};
    }
    
    if (folder.children[fileName]) {
      showToast('File already exists in this folder', 'error');
      return;
    }
    
    folder.children[fileName] = {
      type: 'file',
      name: fileName,
      language: detectLanguage(fileName),
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFileSystem(newFileSystem);
    saveFileSystem(newFileSystem);
    showToast(`Created ${fileName} in ${folderName}`, 'success');
  } catch (error) {
    console.error('Create file in folder error:', error);
    showToast('Failed to create file', 'error');
  }
};

const createFolderInFolder = (folderName, parentFolderName, fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  try {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    
    // Find the parent folder
    const parentFolder = findFolderByName(parentFolderName, newFileSystem);
    if (!parentFolder) {
      showToast(`Folder "${parentFolderName}" not found`, 'error');
      return;
    }
    
    if (!parentFolder.children) {
      parentFolder.children = {};
    }
    
    if (parentFolder.children[folderName]) {
      showToast('Folder already exists in this folder', 'error');
      return;
    }
    
    parentFolder.children[folderName] = {
      type: 'folder',
      name: folderName,
      children: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFileSystem(newFileSystem);
    saveFileSystem(newFileSystem);
    showToast(`Created folder ${folderName} in ${parentFolderName}`, 'success');
  } catch (error) {
    console.error('Create folder in folder error:', error);
    showToast('Failed to create folder', 'error');
  }
};

const findFolderByName = (folderName, fileSystem, currentNode = null) => {
  const searchNode = currentNode || fileSystem;
  
  // Search in roots
  if (searchNode.roots) {
    for (const key in searchNode.roots) {
      const node = searchNode.roots[key];
      if (node.type === 'folder' && node.name === folderName) {
        return node;
      }
      if (node.children) {
        const found = findFolderByName(folderName, fileSystem, { children: node.children });
        if (found) return found;
      }
    }
  }
  
  // Search in root (legacy)
  if (searchNode.root) {
    if (searchNode.root.name === folderName) {
      return searchNode.root;
    }
    if (searchNode.root.children) {
      const found = findFolderByName(folderName, fileSystem, { children: searchNode.root.children });
      if (found) return found;
    }
  }
  
  // Search in children
  if (searchNode.children) {
    for (const key in searchNode.children) {
      const node = searchNode.children[key];
      if (node.type === 'folder' && node.name === folderName) {
        return node;
      }
      if (node.children) {
        const found = findFolderByName(folderName, fileSystem, { children: node.children });
        if (found) return found;
      }
    }
  }
  
  return null;
};

const createQuickFile = (fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  try {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    let targetNode = null;

    // Find target location
    if (newFileSystem.roots) {
      const firstRootKey = Object.keys(newFileSystem.roots)[0];
      if (firstRootKey) {
        targetNode = newFileSystem.roots[firstRootKey];
      }
    } else if (newFileSystem.root) {
      targetNode = newFileSystem.root;
    }

    if (!targetNode) {
      showToast('No folder available', 'error');
      return;
    }

    if (!targetNode.children) {
      targetNode.children = {};
    }

    // Generate unique name
    let counter = 1;
    let fileName = 'newfile.txt';
    while (targetNode.children[fileName]) {
      fileName = `newfile${counter}.txt`;
      counter++;
    }

    targetNode.children[fileName] = {
      type: 'file',
      name: fileName,
      language: 'plaintext',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFileSystem(newFileSystem);
    saveFileSystem(newFileSystem);
    showToast(`Created ${fileName}`, 'success');
  } catch (error) {
    console.error('Quick create file error:', error);
    showToast('Failed to create file', 'error');
  }
};

const createQuickFolder = (fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  try {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    let targetNode = null;

    // Find target location
    if (newFileSystem.roots) {
      const firstRootKey = Object.keys(newFileSystem.roots)[0];
      if (firstRootKey) {
        targetNode = newFileSystem.roots[firstRootKey];
      }
    } else if (newFileSystem.root) {
      targetNode = newFileSystem.root;
    }

    if (!targetNode) {
      showToast('No folder available', 'error');
      return;
    }

    if (!targetNode.children) {
      targetNode.children = {};
    }

    // Generate unique name
    let counter = 1;
    let folderName = 'newfolder';
    while (targetNode.children[folderName]) {
      folderName = `newfolder${counter}`;
      counter++;
    }

    targetNode.children[folderName] = {
      type: 'folder',
      name: folderName,
      children: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFileSystem(newFileSystem);
    saveFileSystem(newFileSystem);
    showToast(`Created ${folderName}`, 'success');
  } catch (error) {
    console.error('Quick create folder error:', error);
    showToast('Failed to create folder', 'error');
  }
};

const createFile = (fileName, fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
  
  // Handle both new (roots) and old (root) structure
  if (newFileSystem.roots) {
    // New structure - create in first root folder
    const firstRootKey = Object.keys(newFileSystem.roots)[0];
    if (firstRootKey) {
      if (!newFileSystem.roots[firstRootKey].children) {
        newFileSystem.roots[firstRootKey].children = {};
      }
      
      if (newFileSystem.roots[firstRootKey].children[fileName]) {
        showToast('File already exists', 'error');
        return;
      }
      
      newFileSystem.roots[firstRootKey].children[fileName] = {
        type: 'file',
        name: fileName,
        language: detectLanguage(fileName),
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      showToast('Please create a folder first', 'warning');
      return;
    }
  } else if (newFileSystem.root) {
    // Old structure
    if (!newFileSystem.root.children) {
      newFileSystem.root.children = {};
    }
    
    if (newFileSystem.root.children[fileName]) {
      showToast('File already exists', 'error');
      return;
    }
    
    newFileSystem.root.children[fileName] = {
      type: 'file',
      name: fileName,
      language: detectLanguage(fileName),
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  setFileSystem(newFileSystem);
  saveFileSystem(newFileSystem);
  showToast(`Created file: ${fileName}`, 'success');
};

const createFolder = (folderName, fileSystem, setFileSystem, saveFileSystem) => {
  if (!fileSystem) return;

  const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
  
  // Handle both new (roots) and old (root) structure
  if (newFileSystem.roots) {
    // New structure - create as root folder
    if (newFileSystem.roots[folderName]) {
      showToast('Folder already exists', 'error');
      return;
    }
    
    newFileSystem.roots[folderName] = {
      type: 'folder',
      name: folderName,
      isRoot: true,
      children: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } else if (newFileSystem.root) {
    // Old structure
    if (!newFileSystem.root.children) {
      newFileSystem.root.children = {};
    }
    
    if (newFileSystem.root.children[folderName]) {
      showToast('Folder already exists', 'error');
      return;
    }
    
    newFileSystem.root.children[folderName] = {
      type: 'folder',
      name: folderName,
      children: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  setFileSystem(newFileSystem);
  saveFileSystem(newFileSystem);
  showToast(`Created folder: ${folderName}`, 'success');
};

const navigateTabs = (direction, openTabs, activeTabId, setActiveTabId) => {
  if (openTabs.length === 0) return;

  const currentIndex = openTabs.findIndex(t => t.id === activeTabId);
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = openTabs.length - 1;
  if (newIndex >= openTabs.length) newIndex = 0;

  setActiveTabId(openTabs[newIndex].id);
  showToast(`Switched to ${openTabs[newIndex].name}`, 'info');
};

const findFileInSystem = (fileName, fileSystem, currentPath = '') => {
  if (!fileSystem) return null;

  for (const key in fileSystem) {
    const node = fileSystem[key];
    const path = currentPath ? `${currentPath}.${key}` : key;

    if (node.type === 'file' && node.name === fileName) {
      return { path, node };
    }

    if (node.type === 'folder' && node.children) {
      const found = findFileInSystem(node.children, fileSystem, `${path}.children`);
      if (found) return found;
    }
  }

  return null;
};

const deleteItem = (path, fileSystem, setFileSystem, saveFileSystem) => {
  try {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    const pathParts = path.split('.').filter(p => p !== 'children');
    
    // Navigate to parent
    let parent = newFileSystem;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (parent[part] && parent[part].children) {
        parent = parent[part].children;
      } else if (parent[part]) {
        parent = parent[part];
      }
    }
    
    // Delete the item
    const itemKey = pathParts[pathParts.length - 1];
    delete parent[itemKey];
    
    setFileSystem(newFileSystem);
    saveFileSystem(newFileSystem);
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Failed to delete item', 'error');
  }
};

// Windows Voice Typing (Win+H)
const triggerWindowsVoiceTyping = () => {
  try {
    // Show instruction to user
    showToast('Press Win+H to open Windows Voice Typing', 'info');
    
    // Try to focus the editor
    const editorElement = document.querySelector('.monaco-editor textarea');
    if (editorElement) {
      editorElement.focus();
    }
  } catch (error) {
    console.error('Error triggering voice typing:', error);
    showToast('Please press Win+H manually to start voice typing', 'warning');
  }
};

// Download selected file/folder
const downloadSelectedItem = (selectedItem) => {
  try {
    const { node } = selectedItem;
    
    if (node.type === 'file') {
      // Download single file
      const blob = new Blob([node.content || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = node.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded: ${node.name}`, 'success');
    } else if (node.type === 'folder') {
      // Download folder as ZIP
      showToast('Downloading folder as ZIP...', 'info');
      downloadFolderAsZip(node);
    }
  } catch (error) {
    console.error('Download error:', error);
    showToast('Failed to download', 'error');
  }
};

// Download folder as ZIP
const downloadFolderAsZip = async (folderNode) => {
  try {
    // Check if JSZip is available
    if (typeof window.JSZip === 'undefined') {
      showToast('JSZip library not loaded. Please refresh the page.', 'error');
      return;
    }

    const JSZip = window.JSZip;
    const zip = new JSZip();

    // Recursive function to add files to zip
    const addToZip = (node, currentPath = '') => {
      if (node.type === 'file') {
        zip.file(currentPath, node.content || '');
      } else if (node.type === 'folder' && node.children) {
        Object.keys(node.children).forEach(key => {
          const child = node.children[key];
          const childPath = currentPath ? `${currentPath}/${child.name}` : child.name;
          addToZip(child, childPath);
        });
      }
    };

    // Add all files from folder
    if (folderNode.children) {
      Object.keys(folderNode.children).forEach(key => {
        const child = folderNode.children[key];
        addToZip(child, child.name);
      });
    }

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderNode.name}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Downloaded: ${folderNode.name}.zip`, 'success');
  } catch (error) {
    console.error('ZIP download error:', error);
    showToast('Failed to create ZIP file', 'error');
  }
};
