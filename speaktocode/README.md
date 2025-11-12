# 🎙️ SpeakToCode - Voice-Controlled Code Editor

A comprehensive voice-controlled code editor built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides a VS Code-like experience with advanced voice control capabilities, supporting 200+ voice commands in English and Hinglish.

## ✨ Features

### Core Features
- **Voice Control System**: 200+ voice commands for complete hands-free coding
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting for 50+ languages
- **File Management**: Complete file system with folders, files, and tree view
- **Multi-Tab Support**: Open and manage multiple files simultaneously
- **Import/Export**: Import and export entire projects with folder structure
- **Authentication**: Secure user authentication with JWT
- **Settings Customization**: Extensive customization options for editor and voice control
- **Touchpad Gestures**: Pinch to zoom, swipe to navigate tabs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Voice Commands Categories
1. **File Operations**: Create, save, delete, rename files and folders
2. **Navigation**: Go to line, switch tabs, jump to definition
3. **Code Editing**: Copy, paste, undo, redo, format code, comment lines
4. **Search & Replace**: Find text, replace text, find in files
5. **Layout & Theme**: Toggle sidebar, zoom, change themes
6. **Voice Control**: Start/stop listening, help commands

### Supported File Types (50+)
JavaScript, TypeScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, HTML, CSS, SCSS, JSON, XML, YAML, Markdown, Shell Script, SQL, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd mern-speaktocode
```

2. **Install server dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/speaktocode
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

5. **Start MongoDB**
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

6. **Run the application**

**Development mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Server:
```bash
npm run server
```

Terminal 2 - Client:
```bash
npm run client
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
mern-speaktocode/
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Editor/         # Main editor components
│   │   │   ├── FileExplorer/   # File tree components
│   │   │   ├── MenuBar/        # Top menu bar
│   │   │   ├── StatusBar/      # Bottom status bar
│   │   │   ├── Modals/         # Modal dialogs
│   │   │   ├── VoiceControl/   # Voice control UI
│   │   │   └── Toast/          # Toast notifications
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                      # Node.js backend
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   └── Project.js
│   ├── routes/                 # Express routes
│   │   ├── auth.js
│   │   ├── files.js
│   │   ├── projects.js
│   │   └── settings.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   └── server.js               # Express server
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🎤 Voice Commands

### File Operations
- "create file [filename]" - Create a new file
- "create folder [foldername]" - Create a new folder
- "save file" - Save current file
- "close file" - Close current file
- "delete file" - Delete selected file
- "rename file to [newname]" - Rename file
- "download file" - Download current file
- "import project" - Import a project
- "export project" - Export current project

### Navigation
- "go to line [number]" - Jump to specific line
- "next tab" - Switch to next tab
- "previous tab" - Switch to previous tab
- "first tab" - Go to first tab
- "last tab" - Go to last tab
- "close tab" - Close current tab

### Code Editing
- "select all" - Select all text
- "copy" - Copy selected text
- "paste" - Paste from clipboard
- "cut" - Cut selected text
- "undo" - Undo last action
- "redo" - Redo last action
- "delete line" - Delete current line
- "duplicate line" - Duplicate current line
- "move line up" - Move line up
- "move line down" - Move line down
- "comment line" - Comment/uncomment line
- "format code" - Format document
- "indent" - Indent selection
- "outdent" - Outdent selection

### Search & Replace
- "find [text]" - Find text in file
- "replace [old] with [new]" - Replace text
- "find next" - Find next occurrence
- "find previous" - Find previous occurrence

### Layout & Theme
- "toggle sidebar" - Show/hide sidebar
- "toggle minimap" - Show/hide minimap
- "split editor" - Split editor view
- "zoom in" - Increase font size
- "zoom out" - Decrease font size
- "reset zoom" - Reset font size
- "dark mode" - Switch to dark theme
- "light mode" - Switch to light theme
- "toggle fullscreen" - Enter/exit fullscreen

### Voice Control
- "stop listening" - Stop voice recognition
- "start listening" - Start voice recognition
- "help" - Show help documentation

## ⌨️ Keyboard Shortcuts

### File Operations
- `Ctrl+N` - New File
- `Ctrl+S` - Save File
- `Ctrl+O` - Open File
- `Ctrl+W` - Close Tab

### Editing
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C` - Copy
- `Ctrl+X` - Cut
- `Ctrl+V` - Paste
- `Ctrl+A` - Select All
- `Ctrl+F` - Find
- `Ctrl+H` - Replace
- `Ctrl+/` - Comment Line

### Navigation
- `Ctrl+G` - Go to Line
- `Ctrl+Tab` - Next Tab
- `Ctrl+Shift+Tab` - Previous Tab
- `Ctrl+P` - Quick Open

### View
- `Ctrl+B` - Toggle Sidebar
- `Ctrl+\\` - Split Editor
- `Ctrl++` - Zoom In
- `Ctrl+-` - Zoom Out
- `Ctrl+0` - Reset Zoom

### Other
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+Shift+V` - Toggle Voice Control
- `Ctrl+,` - Settings
- `F1` - Help

## 🎨 Customization

### Theme Options
- Dark Theme (default)
- Light Theme
- High Contrast Theme

### Editor Settings
- Font family (Consolas, Monaco, Fira Code, JetBrains Mono, etc.)
- Font size (10-24px)
- Tab size (2, 4, 8 spaces)
- Line height
- Cursor style (line, block, underline)
- Word wrap
- Line numbers
- Minimap
- Auto-save
- Format on save

### Voice Settings
- Language (English, Hinglish)
- Sensitivity adjustment
- Continuous listening mode
- Voice feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email domain validation
- Input sanitization
- XSS prevention
- Rate limiting
- Helmet.js security headers
- CORS configuration

## 🌐 Browser Support

- Chrome 80+ (Recommended for voice features)
- Firefox 78+
- Safari 14+
- Edge 80+

**Note**: Voice recognition works best in Chrome and Edge browsers.

## 📱 Touchpad Gestures

- **Two-finger scroll**: Navigate through code
- **Pinch to zoom**: Zoom in/out on editor
- **Three-finger swipe**: Switch between tabs
- **Two-finger tap**: Open context menu

## 🐛 Troubleshooting

### Voice Recognition Not Working
1. Ensure you're using Chrome or Edge browser
2. Grant microphone permissions when prompted
3. Check if microphone is working in system settings
4. Try restarting the browser

### MongoDB Connection Error
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env file
3. Verify MongoDB port (default: 27017)

### Port Already in Use
1. Change PORT in .env file
2. Kill process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

## 🚀 Deployment

### Heroku Deployment

1. **Create Heroku app**
```bash
heroku create your-app-name
```

2. **Add MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
CLIENT_URL=https://your-domain.com
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Files
- `GET /api/files` - Get user's file system
- `POST /api/files` - Update file system
- `DELETE /api/files/reset` - Reset file system

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/reset` - Reset settings

### Projects
- `POST /api/projects/export` - Export project
- `POST /api/projects/import` - Import project

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

SpeakToCode Team

## 🙏 Acknowledgments

- Monaco Editor by Microsoft
- Web Speech API
- React.js
- Express.js
- MongoDB
- Node.js

## 📞 Support

For support, email support@speaktocode.com or open an issue on GitHub.

---

**Happy Coding with Voice! 🎙️💻**
