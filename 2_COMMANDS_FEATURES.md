# ⌨️ Commands, Shortcuts & Features Guide

## English Version

---

## 🎤 Voice Commands

### File Operations

```
"new file"                          → Creates newfile.txt instantly
"new folder"                        → Creates newfolder instantly
"create file [name]"                → Creates file with specific name
"create folder [name]"              → Creates folder with specific name
"make [filename] under [folder]"    → Creates file inside specific folder
"make folder [name] under [folder]" → Creates folder inside specific folder
```

**Examples:**
```
"new file"                          → newfile.txt created
"create file app.js"                → app.js created
"make index.js under src"           → src/index.js created
"make folder components under src"  → src/components/ created
```

---

### File Management

```
"save file"                         → Saves current file
"save"                              → Saves current file
"close file"                        → Closes current tab
"open [filename]"                   → Opens specific file
"delete [filename]"                 → Deletes specific file
"rename"                            → Renames selected file
"download"                          → Downloads selected file/folder
```

---

### Clipboard Operations

```
"copy"                              → Copies selected file/folder
"cut"                               → Cuts selected file/folder
"paste"                             → Pastes copied/cut item
"paste file"                        → Explicitly pastes file
"paste folder"                      → Explicitly pastes folder
```

---

### Editor Commands

```
"select all"                        → Selects all text
"undo"                              → Undo last change
"redo"                              → Redo last change
"find [text]"                       → Finds text in editor
"replace [old] with [new]"          → Replaces text
```

---

### Navigation

```
"next tab"                          → Switches to next tab
"previous tab"                      → Switches to previous tab
"go to line [number]"               → Jumps to specific line
"scroll up"                         → Scrolls editor up
"scroll down"                       → Scrolls editor down
```

---

### Theme & Settings

```
"dark mode"                         → Switches to dark theme
"light mode"                        → Switches to light theme
"high contrast"                     → Switches to high contrast theme
"open settings"                     → Opens settings modal
"close settings"                    → Closes settings modal
```

---

### Voice Typing

```
"typing on"                         → Shows Win+H instruction
"typing off"                        → Shows Escape instruction
```

**Note:** Uses Windows native voice typing (Win+H)

---

### Import/Export

```
"import"                            → Opens import modal
"export"                            → Opens export modal
"import project"                    → Imports project from JSON
"export project"                    → Exports project as JSON
```

---

### Help & Info

```
"help"                              → Opens help modal
"show commands"                     → Shows command palette
"logout"                            → Logs out of application
```

---

## ⌨️ Keyboard Shortcuts

### File Operations

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New File |
| `Ctrl + Shift + N` | New Folder |
| `Ctrl + S` | Save File |
| `Ctrl + W` | Close Tab |
| `Ctrl + O` | Open File |

---

### Editor Commands

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + F` | Find |
| `Ctrl + H` | Replace |
| `Ctrl + A` | Select All |
| `Ctrl + C` | Copy |
| `Ctrl + X` | Cut |
| `Ctrl + V` | Paste |
| `Ctrl + /` | Toggle Comment |
| `Ctrl + D` | Duplicate Line |
| `Ctrl + L` | Select Line |

---

### Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl + Tab` | Next Tab |
| `Ctrl + Shift + Tab` | Previous Tab |
| `Ctrl + G` | Go to Line |
| `Ctrl + Home` | Go to Start |
| `Ctrl + End` | Go to End |
| `Ctrl + ←` | Move Word Left |
| `Ctrl + →` | Move Word Right |

---

### View & Interface

| Shortcut | Action |
|----------|--------|
| `Ctrl + B` | Toggle Sidebar |
| `Ctrl + +` | Zoom In |
| `Ctrl + -` | Zoom Out |
| `Ctrl + 0` | Reset Zoom |
| `F11` | Fullscreen |
| `Ctrl + Shift + P` | Command Palette |

---

### Special

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Clear Console |
| `Ctrl + Shift + K` | Delete Line |
| `Alt + ↑` | Move Line Up |
| `Alt + ↓` | Move Line Down |
| `Ctrl + Enter` | Insert Line Below |
| `Ctrl + Shift + Enter` | Insert Line Above |

---

## 🖱️ Mouse & Touchpad Controls

### File Explorer

| Action | Result |
|--------|--------|
| **Click** 📄 button | Creates newfile.txt |
| **Click** 📁 button | Creates newfolder |
| **Click** file/folder | Selects item |
| **Double-click** file | Opens file in editor |
| **Right-click** file | Shows context menu |
| **Right-click** folder | Shows folder menu |
| **Right-click** empty space | New File/Folder menu |
| **Drag** file/folder | Moves item |
| **Drag** from desktop | Imports files/folders |

---

### Context Menu (Right-Click)

**On File:**
- 📋 Copy
- ✂️ Cut
- ✏️ Rename
- ⬇️ Download
- 🗑️ Delete

**On Folder:**
- 📄 New File
- 📁 New Folder
- 📋 Copy
- ✂️ Cut
- 📌 Paste (if clipboard has item)
- ✏️ Rename
- ⬇️ Download as ZIP
- 🗑️ Delete

---

### Editor

| Action | Result |
|--------|--------|
| **Click** in editor | Places cursor |
| **Double-click** word | Selects word |
| **Triple-click** line | Selects line |
| **Drag** text | Selects text |
| **Right-click** | Shows editor menu |
| **Scroll** wheel | Scrolls up/down |
| **Ctrl + Scroll** | Zoom in/out |

---

### Tabs

| Action | Result |
|--------|--------|
| **Click** tab | Switches to tab |
| **Click** ✕ on tab | Closes tab |
| **Middle-click** tab | Closes tab |
| **Drag** tab | Reorders tabs |

---

## 🎨 Features

### 1. Quick File/Folder Creation
- Click 📄 or 📁 buttons for instant creation
- Auto-generated unique names
- No typing required

### 2. Drag & Drop Import
- Drag files from desktop → File explorer
- Drag entire folders → Imports with structure
- Supports multiple items at once
- Preserves folder hierarchy

### 3. Voice Control
- 50+ voice commands
- Natural language processing
- Hands-free coding
- Click 🎤 to enable

### 4. Multiple Root Folders
- Create multiple parent folders
- Organize projects separately
- Better project structure

### 5. Copy/Paste/Cut
- Right-click context menu
- Voice commands
- Keyboard shortcuts
- Works with files and folders

### 6. Rename Files/Folders
- Right-click → Rename
- Voice: "rename"
- Inline editing
- Duplicate name detection

### 7. Download Files/Folders
- Single file → Downloads as file
- Folder → Downloads as ZIP
- Voice: "download"
- Preserves structure

### 8. Save to Local Disk
- File → Save to Local Folder
- Choose location manually
- One-time save
- Creates all files/folders

### 9. Auto-Save to Local
- File → Enable Auto-Save
- Real-time sync to disk
- 1-second debounce
- Background operation

### 10. Syntax Highlighting
- 50+ languages supported
- Auto-detection by extension
- Color-coded syntax
- IntelliSense support

### 11. IntelliSense
- Auto-completion
- Method suggestions
- Parameter hints
- Snippet support

### 12. Multiple Themes
- Dark Mode (default)
- Light Mode
- High Contrast Mode
- Voice: "dark mode", "light mode"

### 13. File Tree Navigation
- Expandable folders
- Visual hierarchy
- Drag & drop support
- Selection highlighting

### 14. Tab Management
- Multiple open files
- Easy switching
- Close individual tabs
- Keyboard navigation

### 15. Search & Replace
- Find text (Ctrl+F)
- Replace text (Ctrl+H)
- Case-sensitive option
- Regex support

### 16. Import/Export Projects
- Export as JSON
- Import from JSON
- Backup projects
- Share with others

### 17. Keyboard Shortcuts
- 30+ shortcuts
- Standard editor shortcuts
- Customizable (future)
- Productivity boost

### 18. Voice Typing
- Windows Voice Typing (Win+H)
- Natural speech to text
- Automatic punctuation
- Multi-language support

### 19. Command Palette
- Ctrl+Shift+P
- Quick access to commands
- Search functionality
- Keyboard-driven

### 20. Settings Panel
- Customize editor
- Theme selection
- Font size control
- Preferences storage

---