# Setup Instructions - Step by Step

Follow these steps to get your Employee Management System running:

## Step 1: Install Server Dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

## Step 2: Install Client Dependencies

In a new terminal (or after Step 1 completes):

```bash
cd client
npm install
```

Note: This will now install additional dependencies for real-time chat and styling (socket.io-client, tailwindcss, postcss, autoprefixer). If you pull the latest changes, re-run `npm install` in the `client` folder.

## Step 3: Make Sure MongoDB is Running

You need MongoDB installed and running on your system.

**Option A: Local MongoDB**
- Make sure MongoDB service is running
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `server/.env` with your MongoDB Atlas URI

## Step 4: Create Admin User

After MongoDB is running, create the first admin user:

```bash
cd server
npm run create-admin
```

This will create:
- **Email:** admin@example.com
- **Password:** admin123

⚠️ **Important:** Change this password after first login!

## Step 5: Start the Backend Server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:
- "MongoDB Connected"
- "Server running on port 5000"

Keep this terminal open!

## Step 6: Start the Frontend

Open a **NEW terminal** and run:

```bash
cd client
npm start
```

This will:
- Start the React development server
- Open your browser at http://localhost:3000
- Hot-reload on code changes

## Step 7: Login and Test

1. Go to http://localhost:3000
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. You should see the Admin dashboard!

## Quick Test Flow

1. **Create an Employee:**
   - Click "Add Employee"
   - Fill in name and email
   - Save the generated password!

2. **Set Employee Details:**
   - Update salary and work hours for the employee

3. **Assign a Task:**
   - Go to "Tasks" in the navigation
   - Click "Assign Task"
   - Select employee and fill in task details

4. **Test Employee Login:**
   - Logout as admin
   - Login with employee credentials
   - Clock in, view dashboard, check tasks

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `server/.env`
- Try: `mongodb://127.0.0.1:27017/employee_management`

### Port Already in Use
- Change `PORT` in `server/.env` to a different port (e.g., 5001)
- Update `REACT_APP_API_URL` in `client/.env` if you changed the port

### Module Not Found Errors
- Make sure you ran `npm install` in both `server` and `client` folders
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### CORS Errors
- Make sure backend is running on port 5000
- Check that `REACT_APP_API_URL` matches your backend URL

## File Structure

```
EmployeeMNG/
├── server/          # Backend (Node.js/Express)
│   ├── .env         # Environment variables (create this)
│   └── ...
├── client/          # Frontend (React)
│   └── ...
└── README.md        # Full documentation
```

## Email & Real-time chat configuration

To enable email notifications and real-time group chat, add the following environment variables to `server/.env`:

- `SMTP_HOST` - SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP port (e.g., 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - Optional sender email address (defaults to SMTP_USER)
- `CLIENT_ORIGIN` - Frontend origin allowed for socket connections (e.g., http://localhost:3000)

If SMTP variables are not set, email sending will be skipped and logged for development.

For socket chat we use `socket.io` on the backend and the frontend should use `socket.io-client` to connect to the server. The server accepts connections from `CLIENT_ORIGIN` when set.

---

## Manual Testing Checklist ✅

Use this checklist to validate the main flows locally:

1. Install dependencies
   - `cd server && npm install`
   - `cd client && npm install`

2. Start services
   - Start backend: `cd server && npm run dev`
   - Start frontend: `cd client && npm start`

3. Create admin (if needed)
   - `cd server && npm run create-admin`
   - Login at `http://localhost:3000` with `admin@example.com` / `admin123` (change password).

4. Employee creation & login
   - As admin, create an employee (save generated password)
   - Login as employee (use incognito window) and verify dashboard/routes.

5. Task assignment & notifications
   - As admin, assign a task to the employee.
   - If SMTP is configured, employee should receive an email; otherwise, check server logs for `Email skipped` or `Failed to send` messages.
   - If the employee is connected (open in another browser), they should receive a realtime notification in the bell dropdown.

6. Leaves
   - As employee, apply for a leave (`/employee/leaves/apply`).
   - As admin, approve or decline the leave in `/admin/leaves` and confirm employee receives an email (or server logs);
   - If an admin is connected, they will receive a realtime notification in the top-right bell with quick Approve / Decline actions.

7. Groups & chat
   - Admin or any employee can create a group using `/admin/groups` (admin) or `/employee/groups` (employee).
   - Employee opens `/employee/groups`, joins a group and sends messages; messages should show in other connected clients in real-time.

8. Meetings
   - Admin or any employee can schedule a meeting (optionally provide Google Meet URL) using `/admin/meetings/create` or `/employee/meetings/create`.
   - Participants should get an email (if SMTP configured) and a realtime notification if connected.
   - Meeting page (`/employee/meetings` or `/admin/meetings`) shows the meeting and provides a `Join Meeting` link that opens the URL in a new tab.

9. Notifications
   - Check the notification bell in the header (counts and shows recent notifications). Clicking a meeting notification opens the meeting link in a new tab.

10. Env variables
   - To enable emails, set the SMTP env vars in `server/.env`. To allow socket connections from your frontend, set `CLIENT_ORIGIN` to your frontend URL.

---

## Need Help?

Check the main `README.md` file for detailed API documentation and more information.
