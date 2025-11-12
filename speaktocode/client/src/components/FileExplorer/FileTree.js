import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { getFileIcon } from '../../utils/fileIcons';
import ContextMenu from '../Modals/ContextMenu';
import CreateModal from '../Modals/CreateModal';
import './FileTree.css';

const FileTree = ({ node, path, level = 0 }) => {
  const { openFile, selectedItem, setSelectedItem, pasteItem, cutItem } = useEditor();
  const [isExpanded, setIsExpanded] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('file');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedItem({ path, node });
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
      setSelectedFolder(path);
    } else {
      openFile(path, node);
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ path, node }));
  };

  const handleDragOver = (e) => {
    if (node.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (node.type !== 'folder') return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Cut from source and paste to target
      cutItem(data.path, data.node);
      pasteItem(path);
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      path,
      type: node.type,
      name: node.name
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleNewFile = (folderPath) => {
    setCreateType('file');
    setSelectedFolder(folderPath);
    setShowCreateModal(true);
    closeContextMenu();
  };

  const handleNewFolder = (folderPath) => {
    setCreateType('folder');
    setSelectedFolder(folderPath);
    setShowCreateModal(true);
    closeContextMenu();
  };

  if (node.type === 'folder') {
    return (
      <>
        <div
          className={`tree-item folder ${selectedItem?.path === path ? 'selected' : ''} ${dragOver ? 'drag-over' : ''}`}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ paddingLeft: `${level * 12}px` }}
        >
          <span className="icon">{isExpanded ? '📂' : '📁'}</span>
          <span className="name">{node.name}</span>
        </div>
        {isExpanded && node.children && (
          <div className="tree-children">
            {Object.keys(node.children).map(key => (
              <FileTree
                key={key}
                node={node.children[key]}
                path={`${path}.children.${key}`}
                level={level + 1}
              />
            ))}
          </div>
        )}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            path={contextMenu.path}
            type={contextMenu.type}
            name={contextMenu.name}
            onClose={closeContextMenu}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
          />
        )}
        {showCreateModal && (
          <CreateModal
            type={createType}
            onClose={() => setShowCreateModal(false)}
            parentPath={selectedFolder || path}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={`tree-item ${selectedItem?.path === path ? 'selected' : ''}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={handleDragStart}
        style={{ paddingLeft: `${level * 12}px` }}
      >
        <span className="icon" dangerouslySetInnerHTML={{ __html: getFileIcon(node.name) }} />
        <span className="name">{node.name}</span>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          path={contextMenu.path}
          type={contextMenu.type}
          name={contextMenu.name}
          onClose={closeContextMenu}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
        />
      )}
      {showCreateModal && (
        <CreateModal
          type={createType}
          onClose={() => setShowCreateModal(false)}
          parentPath={selectedFolder || path}
        />
      )}
    </>
  );
};

export default FileTree;
