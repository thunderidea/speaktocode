import React, { useState, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { 
  exportProject, 
  exportAsJSON, 
  importZipFile, 
  importJSONFile, 
  importSingleFile 
} from '../../utils/exportImport';
import { showToast } from '../../utils/toast';
import './ContextMenu.css';

const ImportExportModal = ({ onClose }) => {
  const { fileSystem, setFileSystem, saveFileSystem } = useEditor();
  const [activeTab, setActiveTab] = useState('export');
  const fileInputRef = useRef(null);

  const handleExportZip = async () => {
    await exportProject(fileSystem);
    onClose();
  };

  const handleExportJSON = () => {
    exportAsJSON(fileSystem);
    onClose();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.zip')) {
        const imported = await importZipFile(file, async (importedFileSystem) => {
          // Merge with existing file system
          const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
          if (!newFileSystem.root.children) {
            newFileSystem.root.children = {};
          }
          
          // Add imported folder to root
          const folderName = importedFileSystem.name || 'imported';
          newFileSystem.root.children[folderName] = importedFileSystem;
          
          await saveFileSystem(newFileSystem);
          setFileSystem(newFileSystem);
        });
      } else if (fileName.endsWith('.json')) {
        await importJSONFile(file, async (importedFileSystem) => {
          await saveFileSystem(importedFileSystem);
          setFileSystem(importedFileSystem);
        });
      } else {
        // Import as single file
        await importSingleFile(file, async (fileData) => {
          const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
          if (!newFileSystem.root.children) {
            newFileSystem.root.children = {};
          }
          
          newFileSystem.root.children[fileData.name] = fileData;
          
          await saveFileSystem(newFileSystem);
          setFileSystem(newFileSystem);
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      showToast('Failed to import file', 'error');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <h3>Import / Export</h3>
        
        <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'export' ? 'var(--color-accent)' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Export
          </button>
          <button 
            className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'import' ? 'var(--color-accent)' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Import
          </button>
        </div>

        {activeTab === 'export' && (
          <div className="export-section">
            <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
              Export your entire project or specific files
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-primary btn-full-width"
                onClick={handleExportZip}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <span>📦</span>
                <span>Export as ZIP</span>
              </button>
              
              <button 
                className="btn btn-secondary btn-full-width"
                onClick={handleExportJSON}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <span>📄</span>
                <span>Export as JSON</span>
              </button>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,122,204,0.1)', borderRadius: '4px' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                💡 <strong>Tip:</strong> ZIP format preserves folder structure. JSON format can be re-imported to restore your project.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="import-section">
            <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
              Import files, folders, or entire projects
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.json,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.md,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <button 
              className="btn btn-primary btn-full-width"
              onClick={handleImportClick}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <span>📥</span>
              <span>Select File to Import</span>
            </button>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(76,175,80,0.1)', borderRadius: '4px' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, marginBottom: '10px' }}>
                <strong>Supported formats:</strong>
              </p>
              <ul style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, paddingLeft: '20px' }}>
                <li>📦 ZIP files (entire projects)</li>
                <li>📄 JSON files (project structure)</li>
                <li>📝 Individual code files (.js, .py, .java, etc.)</li>
              </ul>
            </div>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button className="btn btn-secondary btn-full-width" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
