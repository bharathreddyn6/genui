# GenUI - Landing Page & Authentication Update

## ✨ What's New

Your GenUI application now has a professional landing page with:

### 🏠 **Landing Page Features**
- **Hero Section** - Eye-catching introduction with gradient animations
- **About Us** - Information about GenUI and its capabilities  
- **Contact Form** - Professional contact section with email/support info
- **Feature Cards** - Highlighting key benefits (Lightning Fast, Beautiful Design, Easy Iteration)
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark Mode Support** - Beautiful gradient themes

### 🔐 **Authentication System**
- **Login Modal** - Users can login with email and password
- **Register Modal** - New users can create accounts
- **Protected Routes** - GenUI component generator is behind authentication
- **User Session** - Login state persisted in localStorage
- **Logout Button** - Easy logout from the app header

## 🚀 How It Works

### User Flow:
1. **Landing Page** (`/`) - First page visitors see
   - Navigation: Home, About Us, Contact
   - Login and Register buttons in header
   
2. **Login/Register** - Modal popups for authentication
   - Simple demo auth (stores user in localStorage)
   - Auto-redirects to app after successful login
   
3. **Protected App** (`/app/*`) - Your GenUI component generator
   - Only accessible after login
   - Header shows username and logout button
   - All existing functionality intact (browse, view, create, iterate)

## 📁 File Structure

```
webapp/src/
├── App.tsx                    # Main router (Landing → App)
├── views/
│   ├── landing.tsx           # NEW: Landing page with auth modals
│   ├── app-wrapper.tsx       # NEW: Protected app wrapper
│   ├── browse.tsx            # Updated: Fixed navigation paths
│   └── view.tsx              # Updated: Fixed back button path
```

## 🔧 Routes

- `/` - Landing page (public)
- `/app` - Component browser (protected)
- `/app/view/:name` - Component detail view (protected)

## 💾 Authentication (Demo)

Currently uses **localStorage** for demo purposes:
- Login: Any email + any password
- User data: `{ email, name }`
- Storage key: `genui_user`

### For Production:
Replace with proper authentication:
- Backend API for user management
- JWT tokens or session cookies
- Password hashing (bcrypt)
- OAuth providers (Google, GitHub)

## 🎨 Styling

The landing page features:
- **Gradient backgrounds** (purple to blue theme)
- **Smooth animations** (scale, fade, gradient)
- **Glass morphism** effects on nav bar
- **Hover effects** on cards and buttons
- **Responsive grid** layouts
- **Modern shadows** and rounded corners

## 🔒 Security Notes

⚠️ **Current Implementation is for Demo Only**

For production deployment, implement:
1. Real backend authentication API
2. Secure password storage (hashing + salting)
3. HTTPS only
4. CSRF protection
5. Rate limiting on login attempts
6. Email verification
7. Password reset functionality

## 🚀 Testing

1. Start your server: `cd server && npm start`
2. Start webapp: `cd webapp && npm run dev`
3. Visit: `http://localhost:5173`
4. You should see the new landing page
5. Click "Login" or "Get Started Free" to access the app

## 📝 Customization

### Update Branding:
- Edit logo/name in `landing.tsx` (line 50-57)
- Change colors: Search for `purple-600` and `blue-600` in landing.tsx
- Update contact info in Contact section (line 200+)

### Modify Authentication:
- `landing.tsx` - handleLogin, handleRegister functions
- `app-wrapper.tsx` - User session check and logout

### Change Content:
- Hero text: Line 70-80 in landing.tsx
- About section: Line 120-180
- Feature cards: Line 85-105

## 🐛 Troubleshooting

**Issue: Stuck on landing page after login**
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

**Issue: 404 on /app routes**
- Ensure vite dev server is running
- Check that all imports are correct

**Issue: Components not loading**
- Backend server must be running on port 3000
- Check API calls in Network tab

## 🎉 Enjoy Your New Landing Page!

Your GenUI app now has a professional, modern landing page that will impress visitors and provide a smooth onboarding experience!
