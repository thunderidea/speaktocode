import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { detectLanguage } from '../../utils/fileIcons';
import { showToast } from '../../utils/toast';
import './CreateModal.css';

const CreateModal = ({ type, onClose, parentPath = '' }) => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { fileSystem, setFileSystem, saveFileSystem } = useEditor();

  const handleCreate = async () => {
    if (isCreating) return;
    
    try {
      setIsCreating(true);
      
      if (!name.trim()) {
        showToast('Please enter a name', 'error');
        return;
      }

      if (!fileSystem) {
        showToast('File system not loaded', 'error');
        return;
      }

      const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
      let current = newFileSystem;
      
      // Handle both new (roots) and old (root) structure
      if (!parentPath || parentPath === 'root' || parentPath === 'roots') {
        // Creating at root level
        if (newFileSystem.roots) {
          // New structure - create in first root or create new root folder
          if (type === 'folder') {
            // Create new root folder
            if (!newFileSystem.roots[name]) {
              newFileSystem.roots[name] = {
                type: 'folder',
                name: name,
                isRoot: true,
                children: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              showToast(`Created root folder: ${name}`, 'success');
              setFileSystem(newFileSystem);
              await saveFileSystem(newFileSystem);
              onClose();
              return;
            } else {
              showToast('Folder with this name already exists', 'error');
              return;
            }
          } else {
            // Create file in first root folder
            const firstRootKey = Object.keys(newFileSystem.roots)[0];
            if (firstRootKey) {
              current = newFileSystem.roots[firstRootKey].children;
            } else {
              showToast('Please create a folder first', 'warning');
              return;
            }
          }
        } else if (newFileSystem.root) {
          // Old structure
          if (!newFileSystem.root.children) {
            newFileSystem.root.children = {};
          }
          current = newFileSystem.root.children;
        } else {
          showToast('Invalid file system structure', 'error');
          return;
        }
      } else {
        // Navigate to the parent directory
        const pathParts = parentPath.split('.').filter(p => p !== 'children');
        
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          
          if (current[part]) {
            // Found the part
            if (i === pathParts.length - 1) {
              // Last part - this is our target folder
              if (!current[part].children) {
                current[part].children = {};
              }
              current = current[part].children;
            } else {
              // Not last part - continue navigation
              current = current[part];
            }
          } else {
            console.error(`Path navigation failed at: ${part}`, pathParts);
            throw new Error(`Invalid path: ${part} not found`);
          }
        }
      }

      // Check if name already exists
      if (current[name]) {
        showToast(`${type === 'file' ? 'File' : 'Folder'} with this name already exists`, 'error');
        return;
      }

      // Create new file or folder
      if (type === 'file') {
        current[name] = {
          type: 'file',
          name: name,
          language: detectLanguage(name),
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        showToast(`Created file: ${name}`, 'success');
      } else {
        current[name] = {
          type: 'folder',
          name: name,
          children: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        showToast(`Created folder: ${name}`, 'success');
      }

      // Update state and save
      setFileSystem(newFileSystem);
      await saveFileSystem(newFileSystem);
      onClose();
      
    } catch (error) {
      console.error('Error creating file/folder:', error);
      showToast(`Failed to create ${type}: ${error.message}`, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content create-content" onClick={(e) => e.stopPropagation()}>
        <h3>Create New {type === 'file' ? 'File' : 'Folder'}</h3>
        <div className="form-group">
          <label>{type === 'file' ? 'File' : 'Folder'} Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={type === 'file' ? 'example.js' : 'New Folder'}
            autoFocus
            disabled={isCreating}
          />
        </div>
        <div className="modal-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
