import React, { useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { showToast } from '../../utils/toast';
import './ContextMenu.css';

const ContextMenu = ({ x, y, path, type, name, onClose, onNewFile, onNewFolder }) => {
  const { fileSystem, setFileSystem, saveFileSystem, settings, copyItem, cutItem, pasteItem, clipboard } = useEditor();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    const handleClick = () => onClose();
    setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 100);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  const handleRename = () => {
    setShowRenameModal(true);
  };

  const confirmRename = async () => {
    try {
      if (!newName.trim()) {
        showToast('Please enter a name', 'error');
        return;
      }

      // Don't do anything if name hasn't changed
      if (newName === name) {
        setShowRenameModal(false);
        onClose();
        return;
      }

      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      const pathParts = path.split('.').filter(p => p !== 'children');
      
      // Navigate to the parent of the item to be renamed
      let parent = newFileSystem;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (parent[part] && parent[part].children) {
          parent = parent[part].children;
        } else if (parent[part]) {
          parent = parent[part];
        } else {
          throw new Error(`Invalid path: ${part}`);
        }
      }

      // Get the item to be renamed
      const itemKey = pathParts[pathParts.length - 1];
      if (parent[itemKey]) {
        // Check if new name already exists
        if (parent[newName]) {
          showToast(`A ${parent[newName].type} with this name already exists`, 'error');
          return;
        }

        // Keep a reference to the item
        const item = { ...parent[itemKey] };
        
        // Delete the old entry
        delete parent[itemKey];
        
        // Update the name and add the new entry
        item.name = newName;
        item.updatedAt = new Date().toISOString();
        parent[newName] = item;

        // Update the file system
        setFileSystem(newFileSystem);
        await saveFileSystem(newFileSystem);
        showToast(`Renamed to: ${newName}`, 'success');
      } else {
        throw new Error('Item not found');
      }
    } catch (error) {
      console.error('Error renaming item:', error);
      showToast(`Failed to rename: ${error.message}`, 'error');
    } finally {
      setShowRenameModal(false);
      onClose();
    }
  };

  const handleDelete = () => {
    if (settings.confirmBeforeDelete) {
      setShowDeleteModal(true);
    } else {
      performDelete();
    }
  };

  const performDelete = async () => {
    try {
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      const pathParts = path.split('.').filter(p => p !== 'children');
      let parent = newFileSystem;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (parent[part] && parent[part].children) {
          parent = parent[part].children;
        } else if (parent[part]) {
          parent = parent[part];
        } else {
          throw new Error(`Invalid path: ${part}`);
        }
      }

      const itemKey = pathParts[pathParts.length - 1];
      if (parent[itemKey]) {
        delete parent[itemKey];

        setFileSystem(newFileSystem);
        await saveFileSystem(newFileSystem);
        showToast(`Deleted: ${name}`, 'success');
      } else {
        throw new Error('Item not found');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast(`Failed to delete: ${error.message}`, 'error');
    } finally {
      setShowDeleteModal(false);
      onClose();
    }
  };

  const handleDownload = async () => {
    const { exportSingleFile, exportFolderAsZip } = await import('../../utils/exportImport');
    
    if (type === 'file') {
      const node = getNodeByPath(path, fileSystem);
      if (node) {
        exportSingleFile(node, name);
      }
    } else {
      const node = getNodeByPath(path, fileSystem);
      if (node) {
        await exportFolderAsZip(node, name);
      }
    }
    onClose();
  };

  const getNodeByPath = (nodePath, fs) => {
    const parts = nodePath.split('.').filter(p => p !== 'children');
    let current = fs;
    
    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  const handleCopy = () => {
    const node = getNodeByPath(path, fileSystem);
    if (node) {
      copyItem(path, node);
      showToast(`Copied: ${name}`, 'success');
    }
    onClose();
  };

  const handleCut = () => {
    const node = getNodeByPath(path, fileSystem);
    if (node) {
      cutItem(path, node);
      showToast(`Cut: ${name}`, 'info');
    }
    onClose();
  };

  const handlePaste = () => {
    if (!clipboard) {
      showToast('Nothing to paste', 'warning');
      onClose();
      return;
    }

    const pastedName = pasteItem(path);
    if (pastedName) {
      showToast(`Pasted: ${pastedName}`, 'success');
    }
    onClose();
  };

  return (
    <>
      <div
        className="context-menu"
        style={{ left: `${x}px`, top: `${y}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'file' ? (
          <>
            <div className="context-menu-item" onClick={handleCopy}>
              📋 Copy
            </div>
            <div className="context-menu-item" onClick={handleCut}>
              ✂️ Cut
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleRename}>
              ✏️ Rename
            </div>
            <div className="context-menu-item" onClick={handleDownload}>
              ⬇️ Download
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleDelete}>
              🗑️ Delete
            </div>
          </>
        ) : (
          <>
            <div className="context-menu-item" onClick={() => onNewFile && onNewFile(path)}>
              📄 New File
            </div>
            <div className="context-menu-item" onClick={() => onNewFolder && onNewFolder(path)}>
              📁 New Folder
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleCopy}>
              📋 Copy
            </div>
            <div className="context-menu-item" onClick={handleCut}>
              ✂️ Cut
            </div>
            {clipboard && (
              <div className="context-menu-item" onClick={handlePaste}>
                📌 Paste
              </div>
            )}
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleRename}>
              ✏️ Rename
            </div>
            <div className="context-menu-item" onClick={handleDownload}>
              ⬇️ Download as ZIP
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleDelete}>
              🗑️ Delete
            </div>
          </>
        )}
      </div>

      {showRenameModal && (
        <div className="modal" onClick={() => setShowRenameModal(false)}>
          <div className="modal-content create-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rename</h3>
            <div className="form-group">
              <label>New Name:</label>
              <input
                type="text"
                className="form-control"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename();
                  if (e.key === 'Escape') setShowRenameModal(false);
                }}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={confirmRename}>Rename</button>
              <button className="btn btn-secondary" onClick={() => setShowRenameModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content create-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{name}"?</p>
            <div className="modal-actions">
              <button className="btn btn-primary" style={{ background: 'var(--color-error)' }} onClick={performDelete}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextMenu;
