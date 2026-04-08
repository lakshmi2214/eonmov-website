# How to Run Your Website Locally

## 🚀 Quick Setup

### Option 1: Using Live Server (Recommended)
1. Install VS Code
2. Install the "Live Server" extension
3. Right-click on `index.html` → "Open with Live Server"
4. Your site will open at `http://localhost:5500`

### Option 2: Using Python
```bash
# If you have Python 3
python -m http.server 8000

# If you have Python 2
python -m SimpleHTTPServer 8000
```
Then visit `http://localhost:8000`

### Option 3: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run it
http-server
```

## 🔧 Why This Fixes CORS Issues

When you open HTML files directly (`file:///`), browsers block JavaScript from making external requests (like to Google Sheets) due to security policies. Running through a local server (`http://localhost`) allows these requests to work properly.

## ✅ Test Your Forms

Once running through localhost:
1. Open browser console (F12)
2. Submit a form
3. You should see debug messages like:
   ```
   🎯 DOM loaded, looking for forms...
   📝 Enquiry form found: true
   🚀 Form submission started
   ```

## 📱 Mobile Testing

To test mobile view:
1. In Chrome: Right-click → Inspect → Click mobile icon
2. Or use browser's responsive design mode
3. The logo should now be visible at the top on mobile

## 🎯 What's Fixed

- ✅ Logo now visible on mobile devices
- ✅ Simplified mobile navbar with centered logo
- ✅ Safe area padding for notched devices
- ✅ Bottom navigation for mobile app experience
- ✅ CORS issues resolved with local server

## 📞 Need Help?

If you still see issues:
1. Make sure you're running through `http://localhost`, not `file:///`
2. Check browser console for error messages
3. Verify Google Apps Script is deployed with "Anyone" access
