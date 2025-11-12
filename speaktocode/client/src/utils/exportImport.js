import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { showToast } from './toast';

// Export single file
export const exportSingleFile = (node, name) => {
  try {
    const blob = new Blob([node.content || ''], { type: 'text/plain' });
    saveAs(blob, name);
    showToast(`Exported: ${name}`, 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToast('Failed to export file', 'error');
  }
};

// Export folder as ZIP
export const exportFolderAsZip = async (node, folderName) => {
  try {
    const zip = new JSZip();
    
    const addToZip = (currentNode, currentPath = '') => {
      if (currentNode.type === 'file') {
        zip.file(currentPath, currentNode.content || '');
      } else if (currentNode.type === 'folder' && currentNode.children) {
        Object.keys(currentNode.children).forEach(key => {
          const child = currentNode.children[key];
          const childPath = currentPath ? `${currentPath}/${child.name}` : child.name;
          addToZip(child, childPath);
        });
      }
    };

    addToZip(node);
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${folderName}.zip`);
    showToast(`Exported: ${folderName}.zip`, 'success');
  } catch (error) {
    console.error('Export ZIP error:', error);
    showToast('Failed to export as ZIP', 'error');
  }
};

// Export entire project
export const exportProject = async (fileSystem) => {
  try {
    const zip = new JSZip();
    
    const addToZip = (currentNode, currentPath = '') => {
      if (currentNode.type === 'file') {
        zip.file(currentPath, currentNode.content || '');
      } else if (currentNode.type === 'folder' && currentNode.children) {
        Object.keys(currentNode.children).forEach(key => {
          const child = currentNode.children[key];
          const childPath = currentPath ? `${currentPath}/${child.name}` : child.name;
          addToZip(child, childPath);
        });
      }
    };

    if (fileSystem && fileSystem.root) {
      addToZip(fileSystem.root, fileSystem.root.name || 'project');
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const projectName = fileSystem.root?.name || 'project';
    saveAs(content, `${projectName}.zip`);
    showToast(`Project exported: ${projectName}.zip`, 'success');
  } catch (error) {
    console.error('Export project error:', error);
    showToast('Failed to export project', 'error');
  }
};

// Export as JSON
export const exportAsJSON = (fileSystem) => {
  try {
    const json = JSON.stringify(fileSystem, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const projectName = fileSystem.root?.name || 'project';
    saveAs(blob, `${projectName}.json`);
    showToast(`Project exported: ${projectName}.json`, 'success');
  } catch (error) {
    console.error('Export JSON error:', error);
    showToast('Failed to export as JSON', 'error');
  }
};

// Import single file
export const importSingleFile = (file, onSuccess) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const fileData = {
          type: 'file',
          name: file.name,
          language: detectLanguageFromExtension(file.name),
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onSuccess && onSuccess(fileData);
        showToast(`Imported: ${file.name}`, 'success');
        resolve(fileData);
      } catch (error) {
        console.error('Import file error:', error);
        showToast('Failed to import file', 'error');
        reject(error);
      }
    };
    
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Import ZIP file
export const importZipFile = async (file, onSuccess) => {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    const fileSystem = {
      type: 'folder',
      name: file.name.replace('.zip', ''),
      children: {}
    };
    
    for (const [path, zipEntry] of Object.entries(contents.files)) {
      if (!zipEntry.dir) {
        const content = await zipEntry.async('text');
        const pathParts = path.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        let current = fileSystem.children;
        
        // Create folder structure
        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i];
          if (!current[folderName]) {
            current[folderName] = {
              type: 'folder',
              name: folderName,
              children: {}
            };
          }
          current = current[folderName].children;
        }
        
        // Add file
        current[fileName] = {
          type: 'file',
          name: fileName,
          language: detectLanguageFromExtension(fileName),
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    onSuccess && onSuccess(fileSystem);
    showToast(`Imported: ${file.name}`, 'success');
    return fileSystem;
  } catch (error) {
    console.error('Import ZIP error:', error);
    showToast('Failed to import ZIP file', 'error');
    throw error;
  }
};

// Import JSON file
export const importJSONFile = async (file, onSuccess) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const fileSystem = JSON.parse(content);
        
        onSuccess && onSuccess(fileSystem);
        showToast(`Imported: ${file.name}`, 'success');
        resolve(fileSystem);
      } catch (error) {
        console.error('Import JSON error:', error);
        showToast('Failed to import JSON file', 'error');
        reject(error);
      }
    };
    
    reader.onerror = () => {
      showToast('Failed to read JSON file', 'error');
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Detect language from file extension
const detectLanguageFromExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    txt: 'plaintext'
  };
  
  return languageMap[ext] || 'plaintext';
};
