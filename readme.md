# Better Auth Demo Application

A full-stack authentication demo application built with **Better Auth**, React Router, and Express.js. This project showcases a modern authentication system with a beautiful UI and secure backend implementation.

## 🚀 Features

- **Modern Authentication**: Built with Better Auth for secure, scalable authentication
- **Full-Stack**: React frontend with Express.js backend
- **TypeScript**: Fully typed for better development experience
- **Database**: Prisma ORM with SQLite for data persistence
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Session Management**: Secure session handling with automatic redirects

## 📸 Preview

![Login Page](./doc_img/Screenshot%202025-06-21%20at%2011.42.46%20PM.png)
![Registration Page](./doc_img/Screenshot%202025-06-21%20at%2011.43.36%20PM.png)
![Dashboard](./doc_img/Screenshot%202025-06-21%20at%2011.43.54%20PM.png)
![User Profile](./doc_img/Screenshot%202025-06-21%20at%2011.44.30%20PM.png)

## 📁 Project Structure

```
better-auth/
├── frontend/          # React Router application
│   ├── app/          # Application routes and components
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Express.js server
│   ├── src/          # Server source code
│   ├── prisma/       # Database schema and migrations
│   └── package.json  # Backend dependencies
└── doc_img/          # Documentation screenshots
```

## 🛠️ Tech Stack

### Frontend
- **React Router v7** - Modern routing with server-side rendering
- **Better Auth** - Authentication library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool

### Backend
- **Express.js** - Web framework
- **Better Auth** - Authentication backend
- **Prisma** - Database ORM
- **SQLite** - Database
- **TypeScript** - Type safety

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhisawesome/better-auth
   cd better-auth
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory, in new terminal)
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📸 Application Screenshots

### Login Page
![Login Page](./doc_img/Screenshot%202025-06-21%20at%2011.42.46%20PM.png)

### Registration Page
![Registration Page](./doc_img/Screenshot%202025-06-21%20at%2011.43.36%20PM.png)

### Dashboard
![Dashboard](./doc_img/Screenshot%202025-06-21%20at%2011.43.54%20PM.png)

### User Profile
![User Profile](./doc_img/Screenshot%202025-06-21%20at%2011.44.30%20PM.png)

## 📚 Documentation & References

### Better Auth Documentation
- [Better Auth Official Docs](https://www.better-auth.com/docs) - Complete authentication library documentation
- [Better Auth GitHub](https://github.com/better-auth/better-auth) - Source code and issues

### Database & ORM
- [Prisma Documentation](https://www.prisma.io/docs/getting-started/quickstart-sqlite) - Database ORM documentation
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart) - Getting started with Prisma

### Frontend Framework
- [React Router Documentation](https://reactrouter.com/) - Modern routing for React
- [React Documentation](https://react.dev/) - React official documentation

### Backend Framework
- [Express.js Documentation](https://expressjs.com/) - Web application framework
- [Node.js Documentation](https://nodejs.org/docs/) - Node.js runtime

### Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npx prisma studio` - Open Prisma database browser
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhijith V** - [GitHub Profile](https://github.com/abhisawesome)

---

> 🤖 **Disclaimer**: This documentation was lovingly crafted by an AI assistant who probably spent more time formatting markdown than actually understanding the codebase. But hey, at least it looks professional! *beep boop* 🤖





