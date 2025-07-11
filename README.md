# PlanHive Frontend 🎯

The frontend application for PlanHive - a real-time collaborative Kanban board built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## 🏗️ Built With

### Core Technologies
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### Key Libraries
- **@dnd-kit** - Modern drag-and-drop for React
- **Socket.IO Client** - Real-time WebSocket communication
- **React Context** - State management for auth and teams

### Development Tools
- **ESLint** - Code linting and style enforcement
- **TypeScript Compiler** - Type checking and compilation
- **Hot Module Replacement** - Instant development feedback

## 📁 Project Structure

```
frontend/
├── public/                   # Static assets
├── src/
│   ├── Components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── team/           # Team management components
│   │   ├── AddTasksForm.tsx  # Task creation form
│   │   ├── Board.tsx        # Main Kanban board
│   │   ├── Column.tsx       # Board columns
│   │   ├── Dashboard.tsx    # Main dashboard layout
│   │   ├── LoadingScreen.tsx # Server health checking
│   │   ├── Task.tsx         # Individual task component
│   │   └── TeamSetup.tsx    # Team creation/joining
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # CSS stylesheets
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   └── types.ts             # TypeScript definitions
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## 🎨 Features

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Smooth drag-and-drop on mobile
- **Adaptive UI**: Interface adjusts to device capabilities
- **Mobile Dialogs**: Optimized forms for mobile interaction

### 🔄 Real-Time Collaboration
- **Live Updates**: See changes from team members instantly
- **WebSocket Integration**: Real-time synchronization
- **Conflict Resolution**: Smart handling of simultaneous edits
- **User Presence**: Shows who's online in the team

### 🎯 Task Management
- **Drag & Drop**: Intuitive task movement between columns
- **Bulk Operations**: Add multiple tasks at once
- **Smart Assign**: Intelligent conflict resolution
- **Activity Logging**: Track all task movements

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start dev server with HMR
npm run dev --host   # Expose dev server to network

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### Environment Setup
Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_NODE_ENV=development
```

## 🌐 API Integration

### Configuration
```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://planhive-backend.onrender.com' 
  : 'http://localhost:5000'
```

### Real-Time Events
- `taskUpdate` - Real-time task changes
- `teamUpdate` - Team member changes  
- `userJoined/userLeft` - Member activity

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run preview  # Test locally
```

### Recommended Platforms
- **Netlify**: Easy GitHub integration
- **Vercel**: Automatic deployments
- **Manual**: Upload `dist/` folder

## 🐛 Troubleshooting

### Common Issues
1. **Build Failures**: Clear `node_modules` and reinstall
2. **TypeScript Errors**: Run `npx tsc --noEmit`
3. **WebSocket Issues**: Check backend server status
4. **Styling Issues**: Verify responsive breakpoints

### Development Tools
- React DevTools for component inspection
- Network tab for API monitoring
- Lighthouse for performance auditing

---

**PlanHive Frontend** - Beautiful, responsive, and fast! 🚀
