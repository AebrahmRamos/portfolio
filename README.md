# Aebrahm Ramos - Portfolio Website

Portfolio and technical blog for Aebrahm Ramos. React 19 and Vite on the front, a Cloudflare Worker with D1 behind it. Light and dark themes, self-hosted fonts, and an accessibility-first build.

## 🚀 Features

- **Fully Responsive Design** - Optimized for all device sizes (mobile, tablet, desktop)
- **Dark Mode Support** - Toggle between light and dark themes with persistent preference
- **Smooth Animations** - Elegant transitions and scroll-based animations
- **Accessibility First** - WCAG 2.1 AA compliant with keyboard navigation support
- **Performance Optimized** - Fast loading with lazy loading and code splitting
- **SEO Ready** - Proper meta tags, semantic HTML, and sitemap

## 📋 Sections

1. **Hero** - Positioning statement, availability, primary calls to action
2. **About** - Background plus a short fact list
3. **Experience** - Professional timeline
4. **Projects** - Four spotlight case studies, then a compact index of the rest
5. **Skills** - Grouped by area
6. **Education** - Degree and coursework
7. **Organizations** - Leadership roles
8. **Contact** - Form, direct links, resume download (`#resume`)
9. **Footer** - Secondary navigation

Plus `/blog`, `/blog/:slug`, `/blog/series/:slug` and an authenticated `/admin`.

## 🛠️ Tech Stack

- **Framework:** React 19 + React Router 7
- **Build:** Vite 7
- **Hosting / API:** Cloudflare Workers + D1 (`src/worker.js`)
- **Styling:** Plain CSS with a design-token layer in `src/m3/tokens/`
- **Fonts:** Geist Variable + Geist Mono, self-hosted via `@fontsource-variable`
- **Icons:** Phosphor, via `react-icons/pi`
- **Editor:** Tiptap (admin blog editor)
- **Mail:** EmailJS + reCAPTCHA v3
- **Language:** JavaScript (ES modules)

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
portfolio/
├── public/              # Static assets
│   └── vite.svg
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   ├── layout/      # Layout components
│   │   └── sections/    # Page sections
│   ├── context/         # React Context providers
│   │   └── ThemeContext.jsx
│   ├── data/            # Static data
│   │   ├── education.js
│   │   ├── experience.js
│   │   ├── projects.js
│   │   └── skills.js
│   ├── m3/              # Design tokens (color, type, shape, spacing, motion)
│   │   ├── tokens/
│   │   └── theme.js     # data-theme attribute flip
│   ├── utils/           # Utility functions
│   │   └── helpers.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json
├── vite.config.js       # Vite configuration
└���─ README.md
```

## 🎨 Customization

### Personal Information

Update the following files with your information:

1. **Data Files** (`src/data/`)
   - `education.js` - Add your educational background
   - `experience.js` - Add your work experience
   - `projects.js` - Add your projects
   - `skills.js` - Add your technical skills

2. **Hero Section** (`src/components/sections/Hero.jsx`)
   - Update profile image URL
   - Update name and description

3. **Contact Information** (`src/components/sections/Contact.jsx`)
   - Update email, LinkedIn, GitHub links
   - Form field names (`firstName`, `lastName`, `email`, `subject`, `message`) must
     stay in sync with the EmailJS template

### Theme colors

Both palettes are static custom properties in `src/m3/tokens/color.css`, keyed on
`:root` and `:root[data-theme="dark"]`. The brand accent is `#377dff`, rendered as
`#1552cc` in light mode and `#5b9bff` in dark so button and link text clears WCAG AA.
`src/m3/theme.js` only flips the `data-theme` attribute.

### Images

Replace placeholder images in:
- Hero section profile image
- Project thumbnails in `src/data/projects.js`

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ♿ Accessibility

This portfolio follows WCAG 2.1 Level AA guidelines:

- Semantic HTML5 elements
- Proper heading hierarchy
- Keyboard navigation support
- Focus indicators
- Color contrast ratios
- Alt text for images
- ARIA labels where needed

## 🐛 Known Issues

None at the moment. Please report any issues you find!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Aebrahm Ramos**
- Email: aebrahmramos.dev@gmail.com
- LinkedIn: [linkedin.com/in/aebrahmramos](https://linkedin.com/in/aebrahmramos)
- GitHub: [github.com/AebrahmRamos](https://github.com/AebrahmRamos)

## 🙏 Acknowledgments

- Phosphor Icons, via React Icons
- Vite team for the blazing fast build tool

---

Made with ❤️ by Aebrahm Ramos
