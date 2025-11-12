import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { showToast } from './toast';

// Export project as ZIP
export const exportProject = async (fileSystem, projectName = 'My Project') => {
  try {
    showToast('Preparing project export...', 'info');
    
    const zip = new JSZip();
    
    // Add files to ZIP recursively
    const addToZip = (node, path = '') => {
      if (node.type === 'folder') {
        const folderPath = path ? `${path}/${node.name}` : node.name;
        if (node.children) {
          Object.values(node.children).forEach(child => {
            addToZip(child, folderPath);
          });
        }
      } else if (node.type === 'file') {
        const filePath = path ? `${path}/${node.name}` : node.name;
        zip.file(filePath, node.content || '');
      }
    };
    
    // Start from root
    if (fileSystem.root && fileSystem.root.children) {
      Object.values(fileSystem.root.children).forEach(child => {
        addToZip(child);
      });
    }
    
    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName.replace(/\s+/g, '_')}.zip`);
    
    showToast('Project exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToast('Error exporting project', 'error');
  }
};

// Export project as JSON
export const exportProjectJSON = (fileSystem, projectName = 'My Project') => {
  try {
    const projectData = {
      projectName,
      fileSystem,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    saveAs(blob, `${projectName.replace(/\s+/g, '_')}.json`);
    
    showToast('Project exported as JSON!', 'success');
  } catch (error) {
    console.error('Export JSON error:', error);
    showToast('Error exporting project', 'error');
  }
};

// Import project from ZIP
export const importProjectZIP = async (file) => {
  try {
    showToast('Importing project...', 'info');
    
    const zip = await JSZip.loadAsync(file);
    const fileSystem = {
      root: {
        type: 'folder',
        name: 'Imported Project',
        children: {}
      }
    };
    
    // Process each file in ZIP
    const promises = [];
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        promises.push(
          zipEntry.async('string').then(content => {
            const pathParts = relativePath.split('/');
            let current = fileSystem.root.children;
            
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
            const fileName = pathParts[pathParts.length - 1];
            const ext = fileName.split('.').pop().toLowerCase();
            current[fileName] = {
              type: 'file',
              name: fileName,
              language: detectLanguageFromExt(ext),
              content: content
            };
          })
        );
      }
    });
    
    await Promise.all(promises);
    showToast('Project imported successfully!', 'success');
    return fileSystem;
  } catch (error) {
    console.error('Import ZIP error:', error);
    showToast('Error importing project', 'error');
    return null;
  }
};

// Import project from JSON
export const importProjectJSON = async (file) => {
  try {
    showToast('Importing project...', 'info');
    
    const text = await file.text();
    const projectData = JSON.parse(text);
    
    if (projectData.fileSystem) {
      showToast('Project imported successfully!', 'success');
      return projectData.fileSystem;
    } else {
      showToast('Invalid project file', 'error');
      return null;
    }
  } catch (error) {
    console.error('Import JSON error:', error);
    showToast('Error importing project', 'error');
    return null;
  }
};

// Import multiple files
export const importFiles = async (files) => {
  try {
    showToast('Importing files...', 'info');
    
    const fileSystem = {
      root: {
        type: 'folder',
        name: 'Imported Files',
        children: {}
      }
    };
    
    for (const file of files) {
      const content = await file.text();
      const ext = file.name.split('.').pop().toLowerCase();
      
      fileSystem.root.children[file.name] = {
        type: 'file',
        name: file.name,
        language: detectLanguageFromExt(ext),
        content: content
      };
    }
    
    showToast(`Imported ${files.length} file(s)`, 'success');
    return fileSystem;
  } catch (error) {
    console.error('Import files error:', error);
    showToast('Error importing files', 'error');
    return null;
  }
};

// Download single file
export const downloadFile = (fileName, content) => {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, fileName);
    showToast(`Downloaded ${fileName}`, 'success');
  } catch (error) {
    console.error('Download file error:', error);
    showToast('Error downloading file', 'error');
  }
};

// Helper function to detect language from extension
const detectLanguageFromExt = (ext) => {
  const languages = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'json': 'json',
    'xml': 'xml',
    'md': 'markdown',
    'sql': 'sql',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'sh': 'shell',
    'yaml': 'yaml',
    'yml': 'yaml'
  };
  return languages[ext] || 'plaintext';
};
