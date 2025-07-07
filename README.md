# TaskFlowAI 

<div align="center">

![TaskFlowAI Logo](public/favicon.svg)

**An intelligent AI-powered task management platform with advanced analytics and automation**

[![Live Demo](https://img.shields.io/badge/🌐_Live_-blue?style=for-the-badge)](https://glassflow-ai-tasks.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Groq](https://img.shields.io/badge/Groq_AI-FF6B35?style=for-the-badge&logo=ai&logoColor=white)](https://groq.com/)

<img width="1080" height="1080" alt="Image" src="https://github.com/user-attachments/assets/084a89b4-800a-42d6-8d9e-f358c5926307" />
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

TaskFlowAI is a next-generation task management platform that combines the power of artificial intelligence with intuitive design to revolutionize how you organize, prioritize, and complete your tasks. Built with modern web technologies and powered by Groq's Llama 3.3 70B model, it offers intelligent insights, automated task analysis, and seamless productivity tracking.

### 🎯 Key Capabilities

- **🤖 AI-Powered Task Analysis**: Intelligent task prioritization and productivity insights using Groq AI
- **📊 Advanced Analytics**: Comprehensive productivity tracking with visual dashboards
- **🔄 Smart Automation**: Automated task suggestions and workflow optimization
- **💬 AI Chat Assistant**: Interactive AI assistant for task management and productivity advice
- **🎨 Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- **🔐 Secure Authentication**: Enterprise-grade security with Clerk authentication

## ✨ Features

### 🔧 Core Features

- **Intelligent Task Management**
  - AI-powered task creation and categorization
  - Smart priority assignment based on context
  - Automated due date suggestions
  - Tag-based organization system
  - Advanced filtering and search capabilities

- **AI Chat Assistant**
  - Natural language task queries
  - Productivity insights and recommendations
  - Voice-to-text support with speech synthesis
  - Real-time task statistics and analytics
  - Contextual help and guidance

- **Advanced Analytics Dashboard**
  - Task completion trends and patterns
  - Productivity metrics and KPIs
  - Time-based performance analysis
  - Priority distribution insights
  - Overdue task tracking

- **Smart Categorization**
  - Today's tasks with intelligent sorting
  - Upcoming tasks with timeline view
  - Important tasks with priority indicators
  - Completed tasks with achievement tracking
  - Archived tasks for historical reference

### 🎨 User Experience

- **Modern Design System**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Theme Support**: Seamless dark/light mode switching
- **Accessibility**: WCAG-compliant design with keyboard navigation
- **Performance**: Optimized with React Query caching and lazy loading
- **Animations**: Smooth transitions and micro-interactions

### 🔐 Security & Data

- **Clerk Authentication**: Secure user management with social login support
- **Supabase Backend**: Scalable database with real-time capabilities
- **Row-Level Security**: User-specific data isolation
- **Data Encryption**: Secure data transmission and storage
- **Privacy-First**: No data tracking or unnecessary data collection

## 🌐 Live Demo

**Production URL**: [Coming Soon](#)

Experience the full functionality of TaskFlowAI with our live demo. The application includes:
- Interactive task management
- AI-powered insights and recommendations
- Real-time analytics dashboard
- Voice-enabled AI assistant

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict typing
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing with lazy loading
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Performant form management
- **Zod** - Runtime type validation and schema parsing

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Row-Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless function execution

### AI & Intelligence
- **Groq AI** - Ultra-fast AI inference with Llama 3.3 70B
- **Natural Language Processing** - Advanced text analysis
- **Speech Synthesis** - Text-to-speech capabilities
- **Intelligent Caching** - Optimized AI response caching
- **Rate Limiting** - Responsible AI usage management

### UI Components & Icons
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Composable charting library
- **React Day Picker** - Flexible date selection
- **Sonner** - Beautiful toast notifications
- **Vaul** - Drawer component for mobile

### Development & Deployment
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Consistent code formatting
- **Vercel** - Edge-optimized deployment platform
- **GitHub** - Version control and collaboration
- **TypeScript** - End-to-end type safety

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm**, **yarn**, or **bun**
- **Git**
- **Supabase Account** (for database)
- **Clerk Account** (for authentication)
- **Groq API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarankumar1325/glassflow-ai-tasks.git
   cd glassflow-ai-tasks
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Groq AI Configuration
   VITE_GROQ_API_KEY=your_groq_api_key

   # Application Configuration
   VITE_APP_URL=http://localhost:5173
   ```

4. **Set up Supabase**
   
   Run the included SQL migrations:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through the Supabase dashboard or CLI
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Application: `http://localhost:5173`
   - Supabase Dashboard: Your Supabase project URL

### Quick Start Guide

1. **Sign up/Login** using Clerk authentication (email, Google, GitHub)
2. **Create your first task** using the intuitive task creation modal
3. **Explore AI features** by chatting with the AI assistant
4. **View analytics** on the dashboard to track your productivity
5. **Customize settings** to personalize your experience

# 📁 Project Structure

> **TaskFlow AI Tasks** - React + TypeScript + Supabase Application

<div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; font-family: 'Courier New', monospace; line-height: 1.6;">

```
glassflow-ai-tasks/
├── 📁 public/                              # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── icon-192.svg
│   └── robots.txt
├── 📁 src/                                 # Application source code
│   ├── 📁 components/                      # React components
│   │   ├── 📁 ai/                          # AI-related components
│   │   │   └── AIChat.tsx                  # AI chat interface
│   │   ├── 📁 auth/                        # Authentication components
│   │   │   └── AuthGuard.tsx               # Route protection
│   │   ├── 📁 layout/                      # Layout components
│   │   │   ├── Header.tsx                  # Application header
│   │   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   │   └── Footer.tsx                  # Application footer
│   │   ├── 📁 providers/                   # Context providers
│   │   │   └── ThemeProvider.tsx           # Theme management
│   │   ├── 📁 tasks/                       # Task management components
│   │   │   ├── TaskCard.tsx                # Individual task display
│   │   │   ├── TaskList.tsx                # Task list container
│   │   │   ├── CreateTaskModal.tsx         # Task creation modal
│   │   │   └── EditTaskModal.tsx           # Task editing modal
│   │   └── 📁 ui/                          # Reusable UI components
│   │       ├── button.tsx                  # Button component
│   │       ├── card.tsx                    # Card component
│   │       ├── dialog.tsx                  # Dialog component
│   │       └── ...                         # (40+ components)
│   ├── 📁 hooks/                           # Custom React hooks
│   │   ├── useSupabaseTasks.ts             # Task management hook
│   │   ├── useTheme.ts                     # Theme management hook
│   │   └── useDebounce.ts                  # Debounce utility hook
│   ├── 📁 integrations/                    # External service integrations
│   │   └── 📁 supabase/                    # Supabase configuration
│   │       ├── client.ts                   # Supabase client setup
│   │       └── types.ts                    # Database type definitions
│   ├── 📁 lib/                             # Utility libraries
│   │   ├── utils.ts                        # Common utilities
│   │   ├── performance.ts                  # Performance monitoring
│   │   └── supabase-clerk.ts               # Supabase-Clerk integration
│   ├── 📁 pages/                           # Page components
│   │   ├── Index.tsx                       # Dashboard/home page
│   │   ├── AIChat.tsx                      # AI chat page
│   │   ├── Today.tsx                       # Today's tasks
│   │   ├── Upcoming.tsx                    # Upcoming tasks
│   │   ├── Important.tsx                   # Important tasks
│   │   ├── Completed.tsx                   # Completed tasks
│   │   ├── Archive.tsx                     # Archived tasks
│   │   ├── Settings.tsx                    # User settings
│   │   └── NotFound.tsx                    # 404 page
│   ├── 📁 services/                        # API services
│   │   └── groqService.ts                  # Groq AI integration
│   ├── 📁 types/                           # TypeScript type definitions
│   │   └── task.ts                         # Task-related types
│   ├── App.tsx                             # Main application component
│   ├── main.tsx                            # Application entry point
│   └── index.css                           # Global styles and animations
├── 📁 supabase/                            # Supabase configuration
│   ├── 📁 functions/                       # Edge functions
│   │   └── 📁 chat-with-tasks/             # AI chat function
│   ├── 📁 migrations/                      # Database migrations
│   │   ├── 20250628140115-.sql             # Initial schema
│   │   ├── 20250629080434-.sql             # RLS policies
│   │   ├── 20250629090000-.sql             # Performance optimizations
│   │   └── 20250629100000-.sql             # Permission fixes
│   └── config.toml                         # Supabase configuration
├── 📄 package.json                         # Dependencies and scripts
├── 📄 tailwind.config.ts                   # Tailwind CSS configuration
├── 📄 tsconfig.json                        # TypeScript configuration
├── 📄 vite.config.ts                       # Vite build configuration
├── 📄 vercel.json                          # Vercel deployment config
├── 📄 components.json                      # shadcn/ui configuration
└── 📄 README.md                            # Project documentation
```

</div>

## 📊 Key Statistics
- **Total Components**: 40+ UI components
- **Pages**: 8 main application pages
- **Hooks**: 3 custom React hooks
- **Services**: Groq AI integration
- **Database**: 4 migration files
- **Tech Stack**: React + TypeScript + Supabase + Tailwind



## 🔌 API Documentation

### Supabase Database Schema

**Tasks Table:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled', 'archived')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[],
  is_important BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE
);
```

### AI Chat API

**Groq Integration:**
```typescript
interface ChatResponse {
  response: string;
  taskStats?: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    due_today: number;
  };
}

// Chat with AI about tasks
POST /api/chat-with-tasks
{
  "message": "What should I focus on today?",
  "userId": "user_123",
  "tasks": Task[]
}
```

### Task Management Operations

```typescript
// Get all tasks for user
const { data: tasks } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Create new task
const { data: newTask } = await supabase
  .from('tasks')
  .insert([taskData])
  .select()
  .single();

// Update task
const { data: updatedTask } = await supabase
  .from('tasks')
  .update(updates)
  .eq('id', taskId)
  .eq('user_id', userId)
  .select()
  .single();
```

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run deploy       # Deploy to Vercel
```

### Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature with TypeScript
   - Add proper error handling and loading states
   - Update types and documentation

2. **Code Quality**
   - ESLint for code linting
   - TypeScript for type safety
   - Consistent component patterns
   - Performance optimizations

3. **Testing Strategy**
   - Manual testing for UI components
   - Database query testing
   - AI integration testing
   - Cross-browser compatibility

### Environment Variables

**Required Environment Variables:**
```env
# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Services
VITE_GROQ_API_KEY=gsk_...

# Application
VITE_APP_URL=http://localhost:5173
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

The application is optimized for Vercel deployment:

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

**Deployment Configuration:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

3. **Configure domain and SSL**
   - Set up custom domain in Vercel dashboard
   - SSL certificates are automatically provisioned

### Database Setup

1. **Create Supabase project**
2. **Run migrations** from `supabase/migrations/`
3. **Configure Row-Level Security** policies
4. **Set up Edge Functions** for AI chat

## 🤝 Contributing

We welcome contributions to TaskFlowAI! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/glassflow-ai-tasks.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: Maintain strict typing throughout the codebase
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes and shadcn/ui components
- **Performance**: Optimize for Core Web Vitals
- **Accessibility**: Follow WCAG guidelines

### Areas for Contribution

- 🐛 Bug fixes and performance improvements
- ✨ New features and AI capabilities
- 📚 Documentation and examples
- 🧪 Testing and quality assurance
- 🎨 UI/UX enhancements
- 🔧 Developer experience improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and database
- **Clerk** - Authentication and user management
- **Groq** - Ultra-fast AI inference
- **Vercel** - Deployment and hosting platform
- **shadcn/ui** - Beautiful UI components
- **Open Source Community** - For the amazing tools and libraries

---

<div align="center">

**Built with ❤️ by Sarankumar**

[🌐 Live Demo](#) • [📧 Contact](mailto:contact@taskflowai.dev) • [📖 Documentation](#)

**TaskFlowAI - Where Intelligence Meets Productivity**

</div>
