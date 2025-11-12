### Prerequisites (Zaroorat)

SpeakToCode install karne se pehle ye sab hona chahiye:

1. **Node.js** (v14 ya usse zyada)
   - Download karo: https://nodejs.org/
   - Check karo: `node --version`

2. **MongoDB** (v4.4 ya usse zyada)
   - Download karo: https://www.mongodb.com/try/download/community
   - Ya MongoDB Atlas use karo (cloud): https://www.mongodb.com/cloud/atlas

3. **Git** (optional)
   - Download karo: https://git-scm.com/

4. **Modern Browser**
   - Chrome (best hai) ya Edge
   - File System Access API ke liye

---

### Step 1: Project Download/Clone Karo

**Option A: ZIP Download**
```bash
1. Project ka ZIP file download karo
2. Extract karo jahan chahiye (jaise: D:\speaktocode)
3. Folder ko terminal mein open karo
```

**Option B: Git se Clone**
```bash
git clone <repository-url>
cd speaktocode
```

---

### Step 2: Dependencies Install Karo

Project folder mein terminal kholo aur run karo:

```bash
# Sab dependencies install karo (client aur server dono)
npm install

# Ya alag alag install karo:
cd client
npm install
cd ..
npm install
```

**Agar error aaye:**

**Error: "npm not found"**
- Solution: Pehle Node.js install karo
- Check karo: `node --version` aur `npm --version`

**Error: "EACCES permission denied"**
- Windows: Terminal ko Administrator se run karo
- Mac/Linux: `sudo npm install` use karo

**Error: "network timeout"**
- Solution: Internet connection check karo
- Ya use karo: `npm install --registry=https://registry.npmjs.org/`

---

### Step 3: MongoDB Setup Karo

**Option A: Local MongoDB**

1. MongoDB Community Server install karo
2. MongoDB service start karo:
   - Windows: Automatically service run hoti hai
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. Check karo MongoDB chal raha hai:
   ```bash
   mongo --version
   # ya
   mongosh
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Account banao: https://www.mongodb.com/cloud/atlas
2. Free cluster banao
3. Connection string lo
4. `.env` file mein update karo

---

### Step 4: Environment Variables Set Karo

Root directory mein `.env` file banao:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/speaktocode
# Ya MongoDB Atlas ke liye:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/speaktocode

# JWT Secret (isko badal do!)
JWT_SECRET=apna-secret-key-yahan-likho
```

**Important:** Security ke liye `JWT_SECRET` ko random string se badal do!

---

### Step 5: Application Run Karo

**Development Mode (Best hai):**
```bash
npm run dev
```

Ye dono start karega:
- Backend server: http://localhost:5000
- Frontend: http://localhost:3000

**Production Mode:**
```bash
# Frontend build karo
cd client
npm run build
cd ..

# Server start karo
npm start
```

---

### Step 6: Application Access Karo

1. Browser kholo (Chrome/Edge best hai)
2. Jao: http://localhost:3000
3. Login page dikhega

**Default Test Account:**
- Email: test@example.com
- Password: password123

Ya "Sign Up" click karke naya account banao

---

### Common Errors aur Solutions

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
1. Check karo MongoDB chal raha hai
2. .env mein MONGODB_URI check karo
3. Firewall settings dekho
4. Try karo: `mongodb://127.0.0.1:27017/speaktocode`

#### Error: "Module not found"
**Solution:**
```bash
# node_modules delete karke phir se install karo
rm -rf node_modules package-lock.json
npm install

# Windows par:
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

### Installation Verify Karo

Check karo sab kuch kaam kar raha hai:

1. ✅ Backend chal raha: http://localhost:5000
2. ✅ Frontend chal raha: http://localhost:3000
3. ✅ Login/signup ho raha
4. ✅ Files/folders ban rahe
5. ✅ Voice control kaam kar raha (🎤 button click karo)

---

### Optional: Voice Control Enable Karo

**Windows:**
1. Browser mein microphone access allow karo
2. Editor mein 🎤 button click karo
3. "hello" bolo test karne ke liye

**Mac:**
1. System Preferences → Security & Privacy → Microphone
2. Browser ko access do
3. 🎤 button click karo

**Linux:**
1. Microphone permissions check karo
2. Install karna pad sakta hai: `sudo apt-get install pulseaudio`

---

### Troubleshooting (Problem Solving)

**Voice kaam nahi kar rahi?**
- Microphone permissions check karo
- Chrome/Edge use karo (better support)
- Browser console mein errors dekho

**Files save nahi ho rahi?**
- MongoDB connection check karo
- Browser console dekho
- Page refresh karo

**Slow chal raha hai?**
- Dusre applications band karo
- MongoDB locally chal raha hai check karo (Atlas se fast hai)
- Browser cache clear karo

---

## Quick Start Commands

```bash
# Complete setup in one go
npm install
npm run dev

# Open browser
# Go to: http://localhost:3000
# Login and start coding!
```

---

## System Requirements

**Minimum:**
- RAM: 4GB
- Storage: 500MB free space
- Internet: For initial setup

**Recommended:**
- RAM: 8GB or more
- Storage: 1GB free space
- Internet: Stable connection
- Microphone: For voice control

---

## Support

**Issues?**
1. Check this guide first
2. Check browser console (F12)
3. Check server logs in terminal
4. Restart application
5. Reinstall dependencies

**Still stuck?**
- Check GitHub issues
- Create new issue with error details
- Include: OS, Node version, error message

---

**Happy Coding! 🚀**