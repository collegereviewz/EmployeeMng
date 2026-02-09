# Quick Fix: MongoDB Connection Error

## The Problem
MongoDB is not running on your computer. You need to either:
1. Start MongoDB locally, OR
2. Use MongoDB Atlas (cloud - easier!)

## EASIEST SOLUTION: Use MongoDB Atlas (5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's free!)
3. Create a FREE cluster (M0 - Free tier)

### Step 2: Setup Database Access
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin` (or any name)
5. Password: Create a password (SAVE IT!)
6. Database User Privileges: Select "Atlas admin"
7. Click "Add User"

### Step 3: Allow Network Access
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 4: Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 5: Update Your .env File
1. Open `server/.env` file
2. Replace the `MONGODB_URI` line with:
   ```
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   ```
   - Replace `YOUR_PASSWORD` with the password you created
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Keep `/employee_management` at the end (this is your database name)

### Step 6: Restart Your Server
1. Stop the server (Ctrl + C)
2. Run `npm run dev` again
3. You should see "MongoDB Connected" ✅

---

## ALTERNATIVE: Install MongoDB Locally

### Windows Installation:
1. Download: https://www.mongodb.com/try/download/community
2. Select: Windows, MSI package
3. Install with default settings
4. Start MongoDB service:
   - Press `Win + R`
   - Type `services.msc`
   - Find "MongoDB" service
   - Right-click → Start
   - Right-click → Properties → Set to "Automatic" (starts on boot)

### Verify MongoDB is Running:
Open a new terminal and run:
```bash
mongod --version
```

If you see version info, MongoDB is installed!

Then restart your server - it should connect automatically.

---

## After MongoDB is Connected:

1. **Create admin user:**
   ```bash
   npm run create-admin
   ```

2. **You're ready to go!** 🎉
