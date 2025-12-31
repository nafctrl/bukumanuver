# How to Run Your App (Beginner's Guide)

Since you are learning, here are the simple steps to get your project running from scratch.

## Step 1: Open the Terminal
You need a command line interface to talk to the computer.
1. Open your code editor (like VS Code).
2. Look for **Terminal** in the top menu and select **New Terminal**.
   - Shortcut: `` Ctrl + ` `` (backtick)

## Step 2: Start the Development Server
This "server" is a program that builds your website and serves it to your browser.

1. Type the following command in the terminal and press **Enter**:
   ```powershell
   npm run dev
   ```

   > **Note:** If you see a red error about "scripts is not digitally signed" or "execution policy", use this special command instead of the one above:
   > ```cmd
   > cmd /c "npm run dev"
   > ```

2. You should see output like:
   ```
   Ready in 1234ms
   - Local: http://localhost:3000
   ```
   **Do not close this terminal!** The server needs to stay running for the site to work.

## Step 3: Open in Browser
1. Open your web browser (Chrome, Edge, etc.).
2. Click on the address bar at the very top.
3. Type this address exactly and press **Enter**:
   ```
   http://localhost:3000
   ```

## Summary
- **Terminal**: `npm run dev`
- **Browser**: `localhost:3000`
- **Stop**: To stop the server, go to the terminal and press `Ctrl + C`.

That's it! You are now running your web application locally.

cmd /c "npm run dev"