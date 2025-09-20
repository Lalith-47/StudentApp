# Career Guidance Frontend

A modern React application built with Vite, Tailwind CSS, and TypeScript for the Career Guidance Platform. This frontend provides an intuitive user interface for career assessment, college discovery, and educational guidance.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp env.example .env
   ```

3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Career Guidance Platform
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_PWA=true
   VITE_DEBUG=false
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   └── UI/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── assets/
│   ├── i18n/
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing

### State Management & Data Fetching
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **React Context**: Global state management

### UI & Animation
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications

### Internationalization
- **React i18next**: Internationalization framework
- **i18next-browser-languagedetector**: Language detection

### Data Visualization
- **Recharts**: Chart and graph components

### PWA Features
- **Vite PWA Plugin**: Progressive Web App support
- **Workbox**: Service worker management

## 📱 Features

### Core Pages
- **Home**: Landing page with feature overview
- **Quiz**: Interactive career assessment
- **Roadmap**: Career path guides and timelines
- **Colleges**: College finder and comparison
- **Stories**: Success stories and testimonials
- **Chatbot**: AI-powered career guidance
- **Dashboard**: Analytics and insights

### Key Features
- **Responsive Design**: Mobile-first approach
- **Multi-language Support**: English and Hindi
- **Offline Support**: PWA with service worker
- **Dark Mode**: Theme switching (future)
- **Accessibility**: WCAG compliance
- **Performance**: Code splitting and lazy loading

## 🎨 UI Components

### Layout Components
- **Navbar**: Navigation with language switcher
- **Footer**: Links and information
- **Layout**: Main layout wrapper

### UI Components
- **Button**: Various button variants
- **Card**: Content containers
- **Input**: Form input fields
- **LoadingSpinner**: Loading indicators

### Page Components
- **Home**: Hero section, features, testimonials
- **Quiz**: Interactive assessment with progress
- **Roadmap**: Course cards and filters
- **Colleges**: College grid with comparison
- **Stories**: Story cards with engagement
- **Chatbot**: Chat interface with suggestions
- **Dashboard**: Analytics charts and metrics

## 🌍 Internationalization

### Supported Languages
- **English**: Default language
- **Hindi**: Complete translation

### Translation Files
- `src/i18n/locales/en.json`: English translations
- `src/i18n/locales/hi.json`: Hindi translations

### Usage
```javascript
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  return <h1>{t('home.title')}</h1>
}
```

## 📊 API Integration

### API Service
- **Axios**: HTTP client with interceptors
- **React Query**: Data fetching and caching
- **Error Handling**: Toast notifications

### API Endpoints
- Quiz submission and results
- Roadmap data and search
- College information and comparison
- Story management and engagement
- FAQ queries for chatbot
- Analytics and dashboard data

## 🎯 State Management

### React Query
- Server state management
- Automatic caching and refetching
- Background updates
- Optimistic updates

### Local State
- React hooks for component state
- Context for global state
- Local storage for persistence

## 📱 PWA Features

### Service Worker
- Offline caching
- Background sync
- Push notifications (future)

### Manifest
- App installation
- Custom icons
- Theme colors
- Display modes

### Offline Support
- Cached resources
- Offline fallbacks
- Background updates

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom design system
- Responsive design
- Dark mode support

### Custom Classes
- Component-specific styles
- Animation utilities
- Layout helpers
- Color system

## 🚀 Performance

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### Optimization
- Image optimization
- Bundle analysis
- Tree shaking
- Minification

### Caching
- Browser caching
- Service worker caching
- API response caching

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_DEBUG`: Debug mode
- `VITE_ENABLE_PWA`: PWA features
- `VITE_ENABLE_ANALYTICS`: Analytics tracking

## 🧪 Testing

### Testing Setup
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Jest**: Test runner

### Test Commands
```bash
npm run test         # Run tests
npm run test:coverage # Run with coverage
npm run test:watch   # Watch mode
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Build Output
- Optimized JavaScript bundles
- Minified CSS
- Compressed assets
- Service worker

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Object storage
- **GitHub Pages**: Free hosting

## 🔒 Security

### Best Practices
- Environment variable protection
- XSS prevention
- CSRF protection
- Content Security Policy

### Dependencies
- Regular security updates
- Vulnerability scanning
- Dependency auditing

## 📈 Analytics

### Performance Monitoring
- Core Web Vitals
- Bundle size analysis
- Runtime performance
- User experience metrics

### Error Tracking
- Error boundaries
- Global error handling
- User feedback collection

## 🎯 Accessibility

### WCAG Compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

### ARIA Labels
- Semantic HTML
- Accessible components
- Form labels
- Navigation landmarks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- ESLint configuration
- Prettier formatting
- TypeScript types
- Component documentation

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the component examples
- Test with the provided data

## 🎯 Future Enhancements

- **Authentication**: User login and profiles
- **Real-time Features**: Live chat and notifications
- **Advanced Analytics**: Detailed user insights
- **Mobile App**: React Native version
- **AI Integration**: Enhanced recommendations
- **Video Content**: Educational videos
- **Social Features**: User communities
- **Payment Integration**: Premium features

---

**Note**: This frontend is designed to work with the Career Guidance Backend API. Make sure the backend is running and properly configured for full functionality.
