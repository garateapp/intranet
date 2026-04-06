# 🚀 Quick Start Guide - Intranet CMS

## Prerequisites Check
- ✅ PHP 8.2+ installed
- ✅ Composer installed
- ✅ Node.js 18+ installed
- ✅ MySQL or SQLite available

## Step-by-Step Setup

### 1. Environment Configuration

The `.env` file is already created. You need to configure your database:

```env
# For MySQL:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=your_password

# OR for SQLite (easier for testing):
DB_CONNECTION=sqlite
DB_DATABASE=C:\Users\Lenovo\Herd\intranet\database\database.sqlite
```

For SQLite, create an empty file:
```bash
touch database/database.sqlite
```

### 2. Google OAuth Setup (Optional but Recommended)

1. Go to https://console.cloud.google.com/
2. Create a new project: "Intranet GreenEx"
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:8000/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### 3. Install Dependencies & Setup

```bash
cd intranet

# Install PHP dependencies
composer install

# Install Node dependencies  
npm install

# Generate application key (already done)
php artisan key:generate

# Create database tables and seed data
php artisan migrate --seed

# Build frontend assets
npm run build
```

### 4. Start the Application

Open TWO terminal windows:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server (for development):**
```bash
npm run dev
```

Or for production:
```bash
npm run build
```

### 5. Access the Application

Visit: http://localhost:8000

### 6. Login

Use the default admin account:
- **Email:** admin@intranet.test
- **Password:** password

OR click "Continuar con Google" if you configured OAuth.

## What's Included

### ✅ Features Ready
- Dual authentication (Email + Google OAuth)
- Dashboard with statistics
- Posts management system
- Categories with custom colors/icons
- Links directory
- Comments system (polymorphic)
- Dynamic settings system
- Beautiful green/orange theme
- Dark mode support
- Responsive design
- Glass-morphism effects

### 📁 Database Structure
- `users` - User accounts
- `posts` - News/articles
- `categories` - Content categories
- `links` - Useful links
- `comments` - Comments (polymorphic)
- `settings` - Configuration settings

### 🎨 Theme
The theme uses your brand colors:
- Primary Green: #038c34
- Lime: #80b61f
- Forest Green: #3f8b42
- Orange: #f78e2c
- Strong Orange: #fe790f

## Next Steps

### Add More Features
1. Create React components for Posts, Categories, Links management
2. Add rich text editor (TipTap or Quill)
3. Add file upload for featured images
4. Create settings page UI
5. Add user roles and permissions
6. Add search and filtering
7. Add pagination
8. Add notifications

### Customization
- Modify theme in `resources/css/app.css`
- Add new settings in SettingsSeeder
- Create more categories
- Add sample content

## Troubleshooting

### Database Connection Error
```bash
# Check database exists
# For MySQL: CREATE DATABASE intranet;
# For SQLite: touch database/database.sqlite

# Clear config cache
php artisan config:clear

# Re-run migrations
php artisan migrate:fresh --seed
```

### Assets Not Loading
```bash
npm run build
php artisan storage:link
```

### Google OAuth Error
- Check credentials in `.env`
- Verify redirect URI matches exactly
- Clear browser cache
- Check Google Console API is enabled

### Port 8000 Already in Use
```bash
php artisan serve --port=8001
# Then visit http://localhost:8001
```

## Development Tips

### Watch for Changes (Development Mode)
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

### Quick Reset
```bash
php artisan migrate:fresh --seed
npm run build
```

### Useful Commands
```bash
php artisan route:list          # List all routes
php artisan db:seed             # Re-run seeders
php artisan config:cache        # Cache config
php artisan view:cache          # Cache views
```

## Support

For issues or questions:
1. Check the README.md
2. Review Laravel logs in `storage/logs/`
3. Check browser console for JS errors
4. Verify .env configuration

---

🎉 **You're ready to go!** The intranet CMS is now running. Start managing your content!
