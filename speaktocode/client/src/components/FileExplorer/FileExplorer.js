import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import FileTree from './FileTree';
import { showToast } from '../../utils/toast';
import { detectLanguage } from '../../utils/fileIcons';
import axios from 'axios';
import './FileExplorer.css';

const FileExplorer = () => {
  const { fileSystem, sidebarCollapsed, setFileSystem } = useEditor();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const handleNewFile = () => {
    // Quick create file with auto-generated name
    createQuickItem('file');
  };

  const handleNewFolder = () => {
    // Quick create folder with auto-generated name
    createQuickItem('folder');
  };

  const createQuickItem = async (type) => {
    try {
      if (!fileSystem) return;

      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      
      // Determine where to create (selected folder or first root)
      let targetNode = null;
      
      if (fileSystem.roots) {
        const firstRootKey = Object.keys(fileSystem.roots)[0];
        if (firstRootKey) {
          targetNode = newFileSystem.roots[firstRootKey];
        }
      } else if (fileSystem.root) {
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
      let itemName = type === 'file' ? 'newfile.txt' : 'newfolder';
      
      while (targetNode.children[itemName]) {
        itemName = type === 'file' ? `newfile${counter}.txt` : `newfolder${counter}`;
        counter++;
      }

      // Create the item
      if (type === 'file') {
        targetNode.children[itemName] = {
          type: 'file',
          name: itemName,
          language: 'plaintext',
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        targetNode.children[itemName] = {
          type: 'folder',
          name: itemName,
          children: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      setFileSystem(newFileSystem);
      await axios.post('/api/files/save', { fileSystem: newFileSystem });
      showToast(`Created ${itemName}`, 'success');
    } catch (error) {
      console.error('Quick create error:', error);
      showToast('Failed to create item', 'error');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.delete('/api/files/reset');
      if (response.data.success) {
        setFileSystem(response.data.fileSystem);
        showToast('File system reset successfully!', 'success');
        setShowResetConfirm(false);
      }
    } catch (error) {
      console.error('Reset error:', error);
      showToast('Failed to reset file system', 'error');
    }
  };

  const handleEmptySpaceContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (contextMenu) {
      const handleClick = () => closeContextMenu();
      setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 100);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [contextMenu]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    showToast('Processing files...', 'info');

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

      // Process all dropped items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await processEntry(entry, targetNode.children);
          }
        }
      }

      setFileSystem(newFileSystem);
      await axios.post('/api/files/save', { fileSystem: newFileSystem });
      showToast('Files imported successfully!', 'success');
    } catch (error) {
      console.error('Drop error:', error);
      showToast('Failed to import files', 'error');
    }
  };

  const processEntry = async (entry, parentNode) => {
    if (entry.isFile) {
      // Process file
      return new Promise((resolve) => {
        entry.file((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target.result;
            const fileName = entry.name;
            
            // Generate unique name if needed
            let uniqueName = fileName;
            let counter = 1;
            while (parentNode[uniqueName]) {
              const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
              const baseName = ext ? fileName.replace(ext, '') : fileName;
              uniqueName = `${baseName}_${counter}${ext}`;
              counter++;
            }

            parentNode[uniqueName] = {
              type: 'file',
              name: uniqueName,
              language: detectLanguage(uniqueName),
              content: content,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            resolve();
          };
          reader.readAsText(file);
        });
      });
    } else if (entry.isDirectory) {
      // Process directory
      const folderName = entry.name;
      
      // Generate unique name if needed
      let uniqueName = folderName;
      let counter = 1;
      while (parentNode[uniqueName]) {
        uniqueName = `${folderName}_${counter}`;
        counter++;
      }

      parentNode[uniqueName] = {
        type: 'folder',
        name: uniqueName,
        children: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Read directory contents
      const dirReader = entry.createReader();
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          for (const childEntry of entries) {
            await processEntry(childEntry, parentNode[uniqueName].children);
          }
          resolve();
        });
      });
    }
  };

  if (!fileSystem) {
    return <div className="sidebar loading">Loading...</div>;
  }

  return (
    <>
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>EXPLORER</h3>
          <div className="sidebar-actions">
            <button className="icon-btn" onClick={handleNewFile} title="New File (Ctrl+N)">📄</button>
            <button className="icon-btn" onClick={handleNewFolder} title="New Folder (Ctrl+Shift+N)">📁</button>
            <button className="icon-btn" onClick={() => setShowResetConfirm(true)} title="Reset File System">🔄</button>
          </div>
        </div>
        <div 
          className="file-tree" 
          onContextMenu={handleEmptySpaceContextMenu}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {fileSystem.roots ? (
            // Multiple root folders support
            Object.keys(fileSystem.roots).map(key => (
              <FileTree 
                key={key} 
                node={fileSystem.roots[key]} 
                path={`roots.${key}`} 
              />
            ))
          ) : fileSystem.root ? (
            // Legacy single root support
            <FileTree node={fileSystem.root} path="root" />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              No files yet. Create a new file or folder to get started.
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px`, position: 'fixed', zIndex: 10000 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => { handleNewFile(); closeContextMenu(); }}>
            📄 New File
          </div>
          <div className="context-menu-item" onClick={() => { handleNewFolder(); closeContextMenu(); }}>
            📁 New Folder
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="modal" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content create-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reset File System?</h3>
            <p>This will restore the default folder structure and delete all your files.</p>
            <p style={{ color: 'var(--color-error)', marginTop: '10px' }}>⚠️ This action cannot be undone!</p>
            <div className="modal-actions">
              <button className="btn btn-primary" style={{ background: 'var(--color-error)' }} onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileExplorer;
