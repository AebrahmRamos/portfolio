# Aebrahm Ramos - Portfolio Website

A modern, responsive portfolio website built with React, Material-UI, and Vite. Features a clean design with dark mode support, smooth animations, and accessibility-first approach.

## 🚀 Features

- **Fully Responsive Design** - Optimized for all device sizes (mobile, tablet, desktop)
- **Dark Mode Support** - Toggle between light and dark themes with persistent preference
- **Smooth Animations** - Elegant transitions and scroll-based animations
- **Accessibility First** - WCAG 2.1 AA compliant with keyboard navigation support
- **Performance Optimized** - Fast loading with lazy loading and code splitting
- **SEO Ready** - Proper meta tags, semantic HTML, and sitemap

## 📋 Sections

1. **Hero** - Introduction with profile image and call-to-action buttons
2. **About Me** - Personal background and quick facts
3. **Education** - Academic background with timeline
4. **Skills & Technologies** - Technical expertise across full-stack development
5. **Featured Projects** - Showcase of development work with live demos
6. **Experience** - Professional experience and internships
7. **Contact** - Contact form and social links
8. **Resume** - Downloadable PDF resume
9. **Footer** - Site navigation and copyright

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **UI Library:** Material-UI (MUI) 7.3.5
- **Styling:** Emotion (CSS-in-JS)
- **Icons:** React Icons 5.5.0
- **Form Handling:** React Hook Form 7.66.0
- **Language:** JavaScript (ES6+)

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
│   ├── theme/           # MUI theme configuration
│   │   └── theme.js
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

### Theme Colors

Edit `src/theme/theme.js` to customize colors:

```javascript
primary: {
  main: '#377dff',  // Primary blue
  // ...
},
secondary: {
  main: '#f9b934',  // Secondary yellow
  // ...
},
```

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

- Material-UI team for the excellent component library
- React Icons for the icon set
- Vite team for the blazing fast build tool

---

Made with ❤️ by Aebrahm Ramos
