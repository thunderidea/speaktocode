# 📦 Installation & Setup Guide

## English Version

### Prerequisites

Before installing SpeakToCode, make sure you have:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

4. **Modern Browser**
   - Chrome (recommended) or Edge
   - For File System Access API support

---

### Step 1: Download/Clone Project

**Option A: Download ZIP**
```bash
1. Download project ZIP file
2. Extract to desired location (e.g., D:\speaktocode)
3. Open folder in terminal/command prompt
```

**Option B: Clone with Git**
```bash
git clone <repository-url>
cd speaktocode
```

---

### Step 2: Install Dependencies

Open terminal in project folder and run:

```bash
# Install all dependencies (both client and server)
npm install

# Or install separately:
cd client
npm install
cd ..
npm install
```

**If you get errors:**

**Error: "npm not found"**
- Solution: Install Node.js first
- Verify: `node --version` and `npm --version`

**Error: "EACCES permission denied"**
- Windows: Run terminal as Administrator
- Mac/Linux: Use `sudo npm install`

**Error: "network timeout"**
- Solution: Check internet connection
- Or use: `npm install --registry=https://registry.npmjs.org/`

---

### Step 3: Setup MongoDB

**Option A: Local MongoDB**

1. Install MongoDB Community Server
2. Start MongoDB service:
   - Windows: MongoDB runs as service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   mongo --version
   # or
   mongosh
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` file with connection string

---

### Step 4: Configure Environment Variables

Create `.env` file in root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/speaktocode
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/speaktocode

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-change-this-in-production
```

**Important:** Change `JWT_SECRET` to a random string for security!

---

### Step 5: Run the Application

**Development Mode (Recommended):**
```bash
npm run dev
```

This starts both:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

**Production Mode:**
```bash
# Build frontend
cd client
npm run build
cd ..

# Start server
npm start
```

---

### Step 6: Access Application

1. Open browser (Chrome/Edge recommended)
2. Go to: http://localhost:3000
3. You should see the login page

**Default Test Account:**
- Email: test@example.com
- Password: password123

Or create new account by clicking "Sign Up"

---

### Common Errors & Solutions

#### Error: "Port 3000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### Error: "MongoDB connection failed"
**Solution:**
1. Check if MongoDB is running
2. Verify MONGODB_URI in .env
3. Check firewall settings
4. Try: `mongodb://127.0.0.1:27017/speaktocode`

#### Error: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows:
rmdir /s /q node_modules
del package-lock.json
npm install
```

#### Error: "Cannot find module 'react'"
**Solution:**
```bash
cd client
npm install
cd ..
```

---

### Verify Installation

Check if everything is working:

1. ✅ Backend running: http://localhost:5000
2. ✅ Frontend running: http://localhost:3000
3. ✅ Can login/signup
4. ✅ Can create files/folders
5. ✅ Voice control working (click 🎤 button)

---

### Optional: Enable Voice Control

**Windows:**
1. Allow microphone access in browser
2. Click 🎤 button in editor
3. Say "hello" to test

**Mac:**
1. System Preferences → Security & Privacy → Microphone
2. Allow browser access
3. Click 🎤 button

**Linux:**
1. Check microphone permissions
2. May need to install: `sudo apt-get install pulseaudio`

---

### Troubleshooting

**Voice not working?**
- Check microphone permissions
- Use Chrome/Edge (better support)
- Check browser console for errors

**Files not saving?**
- Check MongoDB connection
- Check browser console
- Try refreshing page

**Slow performance?**
- Close other applications
- Check MongoDB is running locally (faster than Atlas)
- Clear browser cache

---
