import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '../../context/EditorContext';
import { setEditorInstance } from '../../utils/voiceCommands';
import Breadcrumb from './Breadcrumb';
import Tabs from './Tabs';
import './EditorArea.css';

const EditorArea = () => {
  const { openTabs, activeTabId, settings, updateTabContent, saveCurrentFile } = useEditor();
  const editorRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  const handleEditorDidMount = async (editor, monaco) => {
    editorRef.current = editor;
    
    // Register editor instance for voice commands
    setEditorInstance(editor);

    // Enable IntelliSense for different languages
    const setupLanguageSupport = () => {
      if (!monaco) return;
      
      // Add TypeScript/JavaScript IntelliSense
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES6,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ["node_modules/@types"],
        jsx: monaco.languages.typescript.JsxEmit.React,
        allowJs: true,
      });

      // Add common type definitions
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        ['interface Window {', '  [key: string]: any;', '}'].join('\n'),
        'global.d.ts'
      );
    };

    setupLanguageSupport();

    // Cursor position tracking
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Auto-save on content change
    editor.onDidChangeModelContent(() => {
      if (activeTabId && settings.autoSave) {
        const timeoutId = setTimeout(() => {
          saveCurrentFile();
        }, settings.autoSaveInterval);
        return () => clearTimeout(timeoutId);
      }
    });
  };

  const handleEditorChange = (value) => {
    if (activeTabId && value !== undefined) {
      updateTabContent(activeTabId, value);
    }
  };

  // Apply settings to editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        lineHeight: settings.lineHeight,
        cursorStyle: settings.cursorStyle,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        minimap: { enabled: settings.minimapEnabled },
        autoClosingBrackets: settings.autoCloseBrackets ? 'always' : 'never',
        smoothScrolling: settings.smoothScroll,
        contextmenu: true,
        formatOnPaste: true,
        formatOnType: true
      });
    }
  }, [settings]);

  const getTheme = () => {
    switch (settings.theme) {
      case 'light':
        return 'vs-light';
      case 'high-contrast':
        return 'hc-black';
      default:
        return 'vs-dark';
    }
  };

  return (
    <div className="editor-area">
      <Breadcrumb />
      <Tabs />
      <div className="monaco-editor-container">
        {activeTab ? (
          <Editor
            height="100%"
            language={activeTab.language}
            value={activeTab.content}
            theme={getTheme()}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              tabSize: settings.tabSize,
              lineHeight: settings.lineHeight,
              cursorStyle: settings.cursorStyle,
              wordWrap: settings.wordWrap ? 'on' : 'off',
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              minimap: { enabled: settings.minimapEnabled },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              autoClosingBrackets: settings.autoCloseBrackets ? 'always' : 'never',
              smoothScrolling: settings.smoothScroll,
              // Enable context menu with all options
              contextmenu: true,
              // Enable autocomplete and suggestions
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnCommitCharacter: true,
              acceptSuggestionOnEnter: 'on',
              wordBasedSuggestions: true,
              parameterHints: { 
                enabled: true,
                cycle: true
              },
              suggest: {
                showMethods: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showKeywords: true,
                showWords: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
                showSnippets: true,
                snippetsPreventQuickSuggestions: false,
                localityBonus: true
              },
              // Enable additional editor features
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              folding: true,
              foldingStrategy: 'auto',
              showFoldingControls: 'always',
              matchBrackets: 'always',
              renderWhitespace: 'selection',
              renderLineHighlight: 'all',
              selectionHighlight: true,
              occurrencesHighlight: true,
              codeLens: true,
              colorDecorators: true,
              lightbulb: {
                enabled: true
              },
              // Enable find/replace
              find: {
                seedSearchStringFromSelection: 'always',
                autoFindInSelection: 'never',
                addExtraSpaceOnTop: true
              }
            }}
          />
        ) : (
          <div className="no-file-open">
            <div className="no-file-message">
              <h2>🎙️ Welcome to SpeakToCode</h2>
              <p>Select a file to start editing or create a new one</p>
              <div className="quick-actions">
                <p>Try voice commands:</p>
                <ul>
                  <li>"create file index.js"</li>
                  <li>"open settings"</li>
                  <li>"help"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorArea;
