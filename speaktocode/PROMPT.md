# 🎯 SpeakToCode - AI Generation Prompt

## How to Use

**Copy the prompt below and paste it into any AI platform (ChatGPT, Claude, Gemini, etc.) to generate the complete project.**

---

## 📝 THE PROMPT

```
Create a full-stack voice-controlled code editor web application called "SpeakToCode" with these specifications:

TECH STACK:
Frontend: React 18, Monaco Editor (@monaco-editor/react), Axios, React Router, React Context API
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, CORS
Dev Tools: Concurrently, Nodemon

PROJECT STRUCTURE:
Root/
├── client/ (React frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/ (Login, Signup)
│   │   │   ├── Editor/ (EditorArea, EditorTabs, StatusBar)
│   │   │   ├── FileExplorer/ (FileExplorer, FileTree)
│   │   │   ├── MenuBar/ (MenuBar with File, Edit, View menus)
│   │   │   └── Modals/ (Settings, Help, CommandPalette, ContextMenu, CreateModal, ImportExport)
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── EditorContext.js
│   │   │   └── VoiceContext.js
│   │   ├── utils/
│   │   │   ├── voiceCommands.js
│   │   │   ├── fileIcons.js
│   │   │   └── toast.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── server/
│   ├── models/ (User.js, FileSystem.js)
│   ├── routes/ (auth.js, files.js)
│   ├── middleware/ (auth.js for JWT verification)
│   ├── server.js
│   └── package.json
├── .env
└── package.json (root with concurrently script)

CORE FEATURES:

1. AUTHENTICATION:
   - User registration and login with JWT
   - Password hashing with bcrypt
   - Protected routes
   - Token stored in localStorage
   - 7-day token expiration

2. FILE SYSTEM MANAGEMENT:
   - Multiple root folders support
   - Nested folder structure (unlimited depth)
   - File CRUD operations (Create, Read, Update, Delete)
   - Folder CRUD operations
   - Rename files/folders
   - Copy/Cut/Paste files/folders
   - Download files (single file or ZIP for folders)
   - Drag & drop to reorder within tree
   - Store in MongoDB per user

3. MONACO EDITOR:
   - Full VS Code editor integration
   - Syntax highlighting for 50+ languages (JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON, Markdown, etc.)
   - Auto-detect language from file extension
   - IntelliSense and auto-completion
   - Find and replace (Ctrl+F, Ctrl+H)
   - Multi-cursor support
   - Code folding
   - Minimap
   - Line numbers
   - Bracket matching
   - Auto-indentation
   - Configurable font size and tab size

4. VOICE CONTROL (Web Speech API):
   - 50+ voice commands
   - Continuous listening mode
   - Visual feedback (🎤 icon turns green when active)
   - Commands:
     * File operations: "new file", "new folder", "create file [name]", "create folder [name]", "make [filename] under [foldername]", "make folder [name] under [folder]", "save file", "close file", "delete [name]", "rename", "download"
     * Clipboard: "copy", "cut", "paste", "paste file", "paste folder"
     * Editor: "select all", "undo", "redo", "find [text]", "replace [old] with [new]"
     * Navigation: "next tab", "previous tab", "go to line [number]", "scroll up", "scroll down"
     * Theme: "dark mode", "light mode", "high contrast"
     * Settings: "open settings", "close settings", "help"
     * Typing: "typing on" (shows Win+H instruction), "typing off"

5. QUICK CREATE:
   - Click 📄 button → Creates "newfile.txt" instantly
   - Click 📁 button → Creates "newfolder" instantly
   - Auto-increment if name exists (newfile1.txt, newfile2.txt, etc.)
   - No modal dialogs needed
   - Voice: "new file" or "new folder" for same functionality

6. DRAG & DROP IMPORT:
   - Drag files from desktop → Import to editor
   - Drag entire folders → Import with full structure preserved
   - Support multiple items at once
   - Recursive folder reading
   - Read file contents
   - Auto-detect language
   - Show "Processing files..." toast
   - Use HTML5 Drag & Drop API and FileSystem API

7. LOCAL DISK SAVE:
   - Manual save: File → Save to Local Folder (user picks folder)
   - Auto-save: File → Enable Auto-Save to Local (saves every change after 1-second debounce)
   - Use File System Access API (Chrome/Edge only)
   - Recursive file/folder creation
   - Real-time sync
   - Show green checkmark when auto-save enabled
   - Non-blocking background operation

8. CONTEXT MENUS:
   - Right-click on file: Copy, Cut, Rename, Download, Delete
   - Right-click on folder: New File, New Folder, Copy, Cut, Paste (if clipboard has item), Rename, Download as ZIP, Delete
   - Right-click on empty space: New File, New Folder
   - Click outside to close
   - Position at mouse cursor

9. COPY/CUT/PASTE:
   - Copy/cut files and folders
   - Paste into target folder
   - Auto-rename if duplicate exists (file_1, file_2, etc.)
   - Cut removes from original location
   - Works with voice commands and context menu
   - Visual feedback with toasts

10. TAB MANAGEMENT:
    - Multiple files open in tabs
    - Click tab to switch
    - Close button (✕) on each tab
    - Active tab highlighting
    - Show unsaved indicator (*) if modified
    - Keyboard shortcuts: Ctrl+Tab (next), Ctrl+Shift+Tab (previous)

11. THEMES:
    - Dark Mode (default): #1e1e1e background
    - Light Mode: #ffffff background, #333333 text
    - High Contrast Mode: #000000 background, #ffffff text, #ffff00 accent
    - Switch via voice or settings
    - CSS variables for easy theming
    - Persistent theme selection (localStorage)

12. SETTINGS PANEL:
    - Theme selection
    - Font size control (10-30px)
    - Tab size control (2-8 spaces)
    - Word wrap toggle
    - Minimap toggle
    - Line numbers toggle
    - Auto-save toggle
    - Modal interface
    - Save to localStorage

13. KEYBOARD SHORTCUTS:
    - Ctrl+N: New File
    - Ctrl+Shift+N: New Folder
    - Ctrl+S: Save File
    - Ctrl+W: Close Tab
    - Ctrl+B: Toggle Sidebar
    - Ctrl+Shift+P: Command Palette
    - Ctrl+F: Find
    - Ctrl+H: Replace
    - Ctrl+Z: Undo
    - Ctrl+Y: Redo
    - Ctrl+A: Select All
    - Ctrl+C/X/V: Copy/Cut/Paste
    - Ctrl+/: Toggle Comment
    - Ctrl+D: Duplicate Line

14. IMPORT/EXPORT:
    - Export project as JSON (entire file system)
    - Import project from JSON
    - Download JSON file
    - Upload JSON file
    - Preserve structure and content

15. STATUS BAR:
    - Show current file name
    - Show file language
    - Show line and column number
    - Show file encoding (UTF-8)
    - Show line ending (LF/CRLF)
    - Update on cursor move

16. HELP MODAL:
    - List all voice commands
    - List all keyboard shortcuts
    - Feature explanations
    - Getting started guide
    - Searchable content

17. COMMAND PALETTE:
    - Ctrl+Shift+P to open
    - Search all commands
    - Quick access to features
    - Keyboard navigation
    - Fuzzy search

DATA STRUCTURE:
Store file system in MongoDB as:
{
  userId: ObjectId,
  roots: {
    "My Project": {
      type: "folder",
      name: "My Project",
      isRoot: true,
      children: {
        "src": {
          type: "folder",
          name: "src",
          children: {
            "index.js": {
              type: "file",
              name: "index.js",
              language: "javascript",
              content: "console.log('Hello');",
              createdAt: "2025-10-31T00:00:00.000Z",
              updatedAt: "2025-10-31T00:00:00.000Z"
            }
          }
        }
      }
    }
  }
}

API ENDPOINTS:
POST /api/auth/register - Register user
POST /api/auth/login - Login user
GET /api/files - Get user's file system (protected)
POST /api/files/save - Save file system (protected)
DELETE /api/files/reset - Reset to default (protected)

UI LAYOUT:
┌─────────────────────────────────────────────┐
│  Menu Bar (File, Edit, Selection, View)    │
├──────────┬──────────────────────────────────┤
│          │  Tab Bar (Open Files)            │
│  File    ├──────────────────────────────────┤
│  Tree    │                                  │
│          │     Monaco Editor                │
│  (Left   │     (Main Area)                  │
│  Sidebar)│                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Status Bar (File info, Line:Col)          │
└─────────────────────────────────────────────┘

STYLING:
- Professional VS Code-like appearance
- Smooth animations and transitions
- Responsive design
- Dark theme by default
- CSS variables for theming
- Modern UI with rounded corners
- Hover effects
- Toast notifications for feedback

ENVIRONMENT VARIABLES (.env):
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/speaktocode
JWT_SECRET=your-super-secret-key-change-this

PACKAGE.JSON SCRIPTS:
{
  "scripts": {
    "start": "node server/server.js",
    "server": "nodemon server/server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}

IMPORTANT REQUIREMENTS:
1. Use Web Speech API for voice recognition (window.SpeechRecognition or window.webkitSpeechRecognition)
2. Use File System Access API for local save (window.showDirectoryPicker)
3. Use Monaco Editor from @monaco-editor/react package
4. Implement JWT authentication with protected routes
5. Store file system in MongoDB per user
6. Auto-save to local disk with 1-second debounce
7. Support drag & drop from desktop using HTML5 API
8. Context menus positioned at mouse cursor
9. Quick create without modal dialogs
10. Copy/paste with auto-rename on duplicates
11. Multiple themes with CSS variables
12. Keyboard shortcuts for all major actions
13. Toast notifications for user feedback
14. Error handling for all operations
15. Loading states where appropriate

BROWSER SUPPORT:
- Chrome (recommended for File System Access API)
- Edge (recommended for File System Access API)
- Firefox (limited - no File System Access API)
- Safari (limited - no File System Access API)

SECURITY:
- Hash passwords with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Protected API routes with middleware
- CORS configuration
- Environment variables for secrets
- No sensitive data in client code

PERFORMANCE:
- Debounce auto-save (1 second)
- Efficient file tree rendering
- Lazy load Monaco Editor
- Optimistic UI updates
- Memoize expensive components

ERROR HANDLING:
- Try-catch blocks for async operations
- User-friendly error messages
- Toast notifications for errors
- Fallback for unsupported features
- Console logging for debugging

TESTING:
- Test all voice commands
- Test drag & drop with various file types
- Test local save and auto-save
- Test copy/paste/cut operations
- Test theme switching
- Test keyboard shortcuts
- Test on Chrome and Edge

DELIVERABLES:
1. Complete React frontend with all components
2. Complete Express backend with authentication
3. MongoDB models and schemas
4. All voice commands working
5. Drag & drop import working
6. Local save and auto-save working
7. Context menus working
8. Copy/paste/cut working
9. All themes working
10. README.md with setup instructions
11. .env.example file
12. package.json files configured
13. Professional UI/UX
14. Error handling
15. Toast notifications

Make it production-ready, well-structured, and maintainable. Include comments in code where necessary. Follow React and Node.js best practices.
```

---

## 🎯 What This Prompt Will Generate

When you paste this prompt into an AI assistant, it will create:

### ✅ Complete Frontend (React)
- All components (Auth, Editor, FileExplorer, MenuBar, Modals)
- All context providers (Auth, Editor, Voice)
- All utilities (voice commands, file icons, toast)
- Complete styling (App.css with themes)
- Package.json with dependencies

### ✅ Complete Backend (Node.js)
- Express server setup
- MongoDB models (User, FileSystem)
- API routes (auth, files)
- JWT middleware
- CORS configuration
- Package.json with dependencies

### ✅ All Features Working
- Voice control (50+ commands)
- Drag & drop import
- Local disk save (manual + auto)
- Copy/paste/cut
- Context menus
- Quick create
- Multiple themes
- Tab management
- Monaco Editor integration
- Keyboard shortcuts

### ✅ Documentation
- README.md with setup instructions
- .env.example file
- Comments in code
- Usage instructions

---

## 💡 Tips for Using This Prompt

1. **Copy the entire prompt** (everything between the ``` marks)
2. **Paste into AI platform** (ChatGPT, Claude, Gemini, etc.)
3. **AI will generate all files** - It may split into multiple responses
4. **Ask for specific files** if needed: "Show me the complete EditorContext.js file"
5. **Request modifications**: "Add feature X" or "Change Y to Z"
6. **Ask for clarifications**: "How does the voice control work?"

---

## 🚀 Recommended AI Platforms

### Best Results:
1. **Claude (Anthropic)** - Excellent for large codebases
2. **ChatGPT-4** - Great for complex projects
3. **Gemini Pro** - Good for full-stack projects

### How to Use:
1. Start new conversation
2. Paste entire prompt
3. Wait for AI to generate code
4. Ask for remaining files if needed
5. Copy files to your project

---

## 📝 Example Follow-up Questions

After pasting the prompt, you can ask:

```
"Show me the complete voiceCommands.js file"
"How do I setup MongoDB?"
"Generate the .env.example file"
"Show me the FileExplorer component"
"How does drag & drop work?"
"Generate package.json for client"
"Show me the authentication flow"
```

---

## ⚠️ Important Notes

1. **AI may split response** - Large projects need multiple messages
2. **Ask for complete files** - Don't accept partial code
3. **Test each feature** - Verify everything works
4. **Install dependencies** - Run `npm install` in both client and server
5. **Setup MongoDB** - Make sure MongoDB is running
6. **Use Chrome/Edge** - For File System Access API support

---

## 🎓 What You'll Learn

By using this prompt and studying the generated code:

- React Context API for state management
- Monaco Editor integration
- Web Speech API for voice control
- File System Access API for local disk access
- JWT authentication
- MongoDB with Mongoose
- Express API development
- Drag & drop implementation
- Complex UI component architecture

---

**Happy Coding! 🚀**

**Copy the prompt above and start building! 🎉**
