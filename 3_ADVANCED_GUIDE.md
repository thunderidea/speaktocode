# 🚀 Advanced Guide & Best Practices

## English Version

---

## 📚 Table of Contents

1. [Project Structure](#project-structure)
2. [Workflow Tips](#workflow-tips)
3. [Voice Control Mastery](#voice-control-mastery)
4. [Performance Optimization](#performance-optimization)
5. [Security Best Practices](#security-best-practices)
6. [Backup & Recovery](#backup--recovery)
7. [Collaboration](#collaboration)
8. [Advanced Features](#advanced-features)
9. [Troubleshooting](#troubleshooting)
10. [FAQs](#faqs)

---

## 📁 Project Structure

### Recommended Folder Organization

```
My Project/
├── src/
│   ├── components/
│   ├── utils/
│   ├── services/
│   └── index.js
├── public/
│   ├── images/
│   └── styles/
├── tests/
├── docs/
└── README.md
```

### Best Practices:
- ✅ Keep related files together
- ✅ Use descriptive folder names
- ✅ Separate source and public files
- ✅ Include documentation
- ✅ Add README for each project

---

## 💡 Workflow Tips

### 1. Quick Start Workflow

**Morning Routine:**
```
1. Open browser → http://localhost:3000
2. Enable auto-save: File → Enable Auto-Save
3. Choose project folder on disk
4. Start coding!
```

**Benefits:**
- ✅ All changes save automatically
- ✅ No manual save needed
- ✅ Work directly on local files
- ✅ Real-time backup

---

### 2. Import Existing Project

**Steps:**
```
1. Open file explorer in editor
2. Drag your project folder from desktop
3. Drop in file explorer
4. Wait for "Files imported successfully!"
5. Enable auto-save to sync with disk
```

**Supports:**
- ✅ Entire folder structures
- ✅ Nested folders
- ✅ Multiple files at once
- ✅ Large projects (100+ files)

---

### 3. Efficient File Creation

**Quick Method:**
```
1. Click 📄 or 📁 buttons
2. File/folder created instantly
3. Rename if needed
```

**Voice Method:**
```
Say: "new file"           → newfile.txt
Say: "new folder"         → newfolder
Say: "make app.js under src"  → src/app.js
```

**Context Menu Method:**
```
1. Right-click folder
2. Select "New File" or "New Folder"
3. Enter name
```

---

### 4. Multi-File Editing

**Open Multiple Files:**
```
1. Double-click files to open
2. Use tabs to switch
3. Ctrl+Tab for next tab
4. Ctrl+Shift+Tab for previous
```

**Split View (Future Feature):**
- Side-by-side editing
- Compare files
- Synchronized scrolling

---

### 5. Search Across Files

**Current:**
- Ctrl+F searches in current file

**Pro Tip:**
- Export project as JSON
- Use external tool to search
- Re-import if needed

---

## 🎤 Voice Control Mastery

### Level 1: Basic Commands

```
"new file"
"save file"
"dark mode"
"help"
```

**Practice:** Use these daily until natural

---

### Level 2: File Management

```
"create file app.js"
"make index.js under src"
"delete test.js"
"rename"
"download"
```

**Practice:** Create a small project using only voice

---

### Level 3: Advanced Workflow

```
"make folder components under src"
"make button.jsx under components"
"copy"
"paste"
"typing on" → Win+H → Speak code
```

**Practice:** Build entire component structure with voice

---

### Voice Control Tips:

1. **Speak Clearly:** Enunciate words
2. **Pause Between Commands:** Give 1-2 seconds
3. **Use Exact Names:** "app.js" not "app dot js"
4. **Check Microphone:** Ensure good quality
5. **Quiet Environment:** Reduce background noise

---

### Common Voice Mistakes:

❌ "create file app dot js" → Use: "create file app.js"
❌ Speaking too fast → Slow down
❌ Multiple commands at once → One at a time
❌ Unclear pronunciation → Practice names

---

## ⚡ Performance Optimization

### 1. MongoDB Performance

**Local vs Cloud:**
- ✅ Local MongoDB: Faster (recommended for development)
- ⚠️ MongoDB Atlas: Slower but accessible anywhere

**Optimize Local MongoDB:**
```javascript
// In .env file
MONGODB_URI=mongodb://127.0.0.1:27017/speaktocode

// Use 127.0.0.1 instead of localhost (faster DNS)
```

---

### 2. Browser Performance

**Best Browsers:**
1. Chrome (recommended)
2. Edge (recommended)
3. Brave
4. Opera

**Avoid:** Firefox, Safari (limited File System API)

**Optimize:**
- Close unused tabs
- Clear cache regularly (Ctrl+Shift+Delete)
- Disable unnecessary extensions
- Use incognito for testing

---

### 3. File System Performance

**Auto-Save Optimization:**
- 1-second debounce (default)
- Saves only when you stop typing
- Background operation (non-blocking)

**Manual Save:**
- Ctrl+S for immediate save
- Use when auto-save disabled

---

### 4. Large Projects

**Handling 100+ Files:**
- ✅ Use auto-save (handles async)
- ✅ Import in batches if needed
- ✅ Close unused tabs
- ✅ Use search instead of scrolling

**Performance Tips:**
- Collapse unused folders
- Keep file tree organized
- Use keyboard shortcuts
- Minimize context menu usage

---

## 🔒 Security Best Practices

### 1. Environment Variables

**Never commit:**
```env
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://...
```

**Use .gitignore:**
```
.env
.env.local
.env.production
```

---

### 2. JWT Secret

**Generate Strong Secret:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://randomkeygen.com/
```

**Change Default:**
```env
# Bad
JWT_SECRET=your-super-secret-key-change-this-in-production

# Good
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03a0cd273e7f5a7f7e7c7e7c7e7c7e7c
```

---

### 3. Password Security

**User Passwords:**
- ✅ Hashed with bcrypt
- ✅ Never stored in plain text
- ✅ Minimum 6 characters

**Best Practices:**
- Use strong passwords
- Don't share accounts
- Change password regularly

---

### 4. Local File Access

**Permissions:**
- Browser asks for folder access
- Grant only to trusted folders
- Revoke access when done

**Security:**
- Files saved locally (not cloud)
- No third-party access
- Full control over data

---

## 💾 Backup & Recovery

### 1. Export Project

**Manual Backup:**
```
1. Click "File" menu
2. Click "Export"
3. Choose "Export as JSON"
4. Save JSON file to safe location
```

**Automated Backup:**
```
1. Enable auto-save to local folder
2. Use version control (Git)
3. Regular exports to cloud storage
```

---

### 2. Import Project

**Restore from Backup:**
```
1. Click "File" menu
2. Click "Import"
3. Choose "Import from JSON"
4. Select backup JSON file
5. Project restored!
```

---

### 3. Version Control Integration

**Using Git:**
```bash
# Initialize in auto-save folder
cd D:\MyProjects\my-app
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

**Benefits:**
- ✅ Full version history
- ✅ Collaborate with team
- ✅ Rollback changes
- ✅ Branch management

---

### 4. Cloud Backup

**Options:**
1. **Google Drive:** Auto-sync folder
2. **Dropbox:** Sync project folder
3. **OneDrive:** Windows integration
4. **GitHub:** Version control + backup

**Setup:**
```
1. Enable auto-save to synced folder
2. Example: D:\GoogleDrive\Projects\my-app
3. Files auto-backup to cloud
```

---

## 👥 Collaboration

### 1. Share Project

**Method 1: Export/Import**
```
1. Export project as JSON
2. Share JSON file
3. Team imports JSON
```

**Method 2: Auto-Save + Cloud**
```
1. Enable auto-save to cloud folder
2. Share folder with team
3. Real-time collaboration
```

**Method 3: Git Repository**
```
1. Push to GitHub/GitLab
2. Team clones repository
3. Import to editor
4. Enable auto-save to local clone
```

---

### 2. Code Review

**Current Workflow:**
```
1. Export project
2. Share with reviewer
3. Reviewer imports
4. Makes changes
5. Exports back
6. You import changes
```

**Future Feature:** Real-time collaboration

---

## 🔥 Advanced Features

### 1. Custom File Templates

**Create Template:**
```javascript
// In src/templates/component.jsx
import React from 'react';

const ComponentName = () => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

**Use Template:**
```
1. Copy template file
2. Paste in desired location
3. Rename and modify
```

---

### 2. Snippets (Future)

**Planned:**
- Custom code snippets
- Quick insertion
- Variable placeholders
- Tab stops

---

### 3. Multi-Cursor Editing

**Current:** Single cursor

**Future:**
- Alt+Click for multiple cursors
- Ctrl+D for next occurrence
- Edit multiple lines simultaneously

---

### 4. Extensions (Future)

**Planned:**
- ESLint integration
- Prettier formatting
- Git integration
- Custom themes
- Language servers

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Voice Commands Not Working

**Check:**
- ✅ Microphone permissions granted
- ✅ Using Chrome/Edge
- ✅ 🎤 button is active (green)
- ✅ Microphone is working (test in other apps)

**Solutions:**
```
1. Refresh page
2. Click 🎤 button again
3. Check browser console (F12)
4. Try different browser
5. Restart browser
```

---

#### 2. Auto-Save Not Working

**Check:**
- ✅ Folder permission granted
- ✅ Using Chrome/Edge
- ✅ Green checkmark in File menu
- ✅ Files exist in local folder

**Solutions:**
```
1. Disable and re-enable auto-save
2. Choose folder again
3. Check folder permissions
4. Try different folder
5. Check browser console
```

---

#### 3. Files Not Importing

**Check:**
- ✅ Dragging to correct area
- ✅ Files are text-based
- ✅ Not too many files at once

**Solutions:**
```
1. Import in smaller batches
2. Check file types (text only)
3. Try one file first
4. Check browser console
5. Refresh and retry
```

---

#### 4. Slow Performance

**Solutions:**
```
1. Close unused tabs
2. Use local MongoDB
3. Clear browser cache
4. Restart browser
5. Check system resources
6. Reduce open files
```

---

#### 5. MongoDB Connection Failed

**Solutions:**
```
1. Check MongoDB is running
2. Verify MONGODB_URI in .env
3. Try: mongodb://127.0.0.1:27017/speaktocode
4. Restart MongoDB service
5. Check firewall settings
6. Use MongoDB Atlas as fallback
```

---

## ❓ FAQs

### General

**Q: Is my data safe?**
A: Yes! Files are stored locally and in your MongoDB. Enable auto-save for local backup.

**Q: Can I use offline?**
A: Partially. Need internet for initial load, but can work offline after. Auto-save to local works offline.

**Q: Which browsers work best?**
A: Chrome and Edge (for File System Access API).

**Q: Can I use on mobile?**
A: Not optimized for mobile yet. Desktop only.

---

### Voice Control

**Q: Which languages supported?**
A: Currently English. More languages planned.

**Q: Can I customize voice commands?**
A: Not yet. Future feature.

**Q: Voice typing not working?**
A: Use Windows Voice Typing (Win+H) instead.

---

### File Management

**Q: Maximum file size?**
A: No hard limit, but large files (>10MB) may slow down.

**Q: Supported file types?**
A: All text-based files. Binary files not recommended.

**Q: Can I import from GitHub?**
A: Clone locally first, then drag folder into editor.

---

### Auto-Save

**Q: How often does it save?**
A: 1 second after you stop typing.

**Q: Can I change save frequency?**
A: Not yet. Future feature.

**Q: Does it work with Git?**
A: Yes! Enable auto-save in Git repository folder.

---

### Performance

**Q: How many files can I have?**
A: Tested with 500+ files. Performance depends on system.

**Q: Why is it slow?**
A: Check MongoDB connection, close unused tabs, clear cache.

---