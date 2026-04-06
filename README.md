# Intranet CMS - Laravel + React + Inertia + DaisyUI

A modern, highly configurable intranet portal built with Laravel 12, React 19, Inertia.js, and DaisyUI. This CMS allows you to manage news, updates, links of interest, and more.

## Features

✅ **Dual Authentication System**
- Email/Password login
- Google OAuth integration

✅ **Content Management**
- Posts/Articles with rich text editor
- Categories with custom colors and icons
- Links directory
- Comments system
- Featured and pinned posts

✅ **Highly Configurable**
- Dynamic settings system
- Theme customization
- SEO configuration
- User preferences

✅ **Modern Tech Stack**
- Laravel 12 (PHP 8.2+)
- React 19 with TypeScript
- Inertia.js for SPA experience
- TailwindCSS 4 + DaisyUI
- Vite 7 for fast builds

✅ **Beautiful UI**
- Green/Orange brand theme
- Glass-morphism effects
- Animated backgrounds
- Dark mode support
- Responsive design

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and NPM
- MySQL 8.0+ or SQLite

## Installation

### 1. Clone and Setup Environment

```bash
cd intranet
cp .env.example .env
php artisan key:generate
```

### 2. Configure Database

Edit `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://yourdomain.test/auth/google/callback`
6. Update `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://yourdomain.test/auth/google/callback
```

### 4. Install Dependencies

```bash
composer install
npm install
```

### 5. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

### 6. Build Assets

```bash
npm run dev
```

### 7. Start the Application

```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Default Admin Account

After running migrations and seeders, you can login with:

- **Email:** admin@intranet.test
- **Password:** password

## Project Structure

```
intranet/
├── app/
│   ├── Http/Controllers/    # Controllers
│   └── Models/              # Eloquent models
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/            # Database seeders
├── resources/
│   ├── css/app.css         # Main CSS with theme
│   ├── js/
│   │   ├── Components/     # Reusable React components
│   │   ├── Layouts/        # Layout components
│   │   └── Pages/          # Page components
│   └── views/              # Blade templates
└── routes/
    └── web.php             # Web routes
```

## Available Routes

### Public Routes
- `/` - Welcome page
- `/login` - Login page
- `/register` - Registration page
- `/auth/google` - Google OAuth

### Authenticated Routes
- `/dashboard` - Dashboard with stats
- `/posts` - Posts management
- `/categories` - Categories management
- `/links` - Links management
- `/settings` - System settings
- `/profile` - User profile

## Development

### Run Development Server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

### Build for Production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Run Tests

```bash
php artisan test
npm run test
```

## Configuration

### Settings System

The settings are stored in the database and can be managed from the admin panel:

```php
// Get a setting
$setting = Setting::get('site_name', 'Default Name');

// Set a setting
Setting::set('site_name', 'My Intranet');

// Get settings by group
$seoSettings = Setting::group('seo');
```

### Theme Customization

The theme is defined in `resources/css/app.css` and uses CSS custom properties. You can customize colors, spacing, and other design tokens.

## Troubleshooting

### Google OAuth Not Working

1. Check that Google Client ID and Secret are set in `.env`
2. Verify redirect URI matches in Google Console
3. Clear config cache: `php artisan config:clear`

### Assets Not Loading

```bash
npm run build
php artisan storage:link
```

### Database Errors

```bash
php artisan migrate:fresh --seed
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Laravel, React, and Inertia
