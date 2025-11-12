import React from 'react';
import { useEditor } from '../../context/EditorContext';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const { openTabs, activeTabId } = useEditor();
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  return (
    <div className="breadcrumb">
      <span className="breadcrumb-item">My Project</span>
      {activeTab && (
        <>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{activeTab.name}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
