# Questions Management System

A modern, full-stack web application for managing programming questions and their solutions. Built with Node.js, Express, Firebase Firestore, and modern frontend technologies.

[This Site Live at Here](https://yeswecode.onrender.com)

## Features

### Backend
- **REST API** with full CRUD operations
- **Firebase Firestore** integration for data persistence
- **MVC Architecture** with proper separation of concerns
- **Input validation** and comprehensive error handling
- **CORS support** and security middleware
- **Request logging** with Morgan

### Frontend
- **Responsive design** with Tailwind CSS
- **Dark/Light mode** toggle
- **Syntax highlighting** with Prism.js
- **Search functionality** for filtering questions
- **Modern animations** and micro-interactions
- **Mobile-first** approach

### Admin Panel
- **Secure admin interface** for content management
- **Add, edit, delete** questions with real-time validation
- **Form handling** with success/error notifications
- **Responsive design** optimized for all devices

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Syntax Highlighting**: Prism.js
- **Icons**: Lucide React
- **Build Tools**: PostCSS, Autoprefixer

## Project Structure

```
project/
├── server/
│   ├── app.js                 # Express server setup
│   ├── routes/
│   │   └── questions.js       # API routes
│   ├── controllers/
│   │   └── questionsController.js  # Business logic
│   └── services/
│       └── firestoreService.js     # Database operations
├── public/
│   ├── css/
│   │   └── main.css          # Compiled Tailwind CSS
│   └── js/
│       ├── theme.js          # Theme management
│       ├── home.js           # Homepage functionality
│       ├── question.js       # Question detail page
│       └── admin.js          # Admin panel logic
├── views/
│   ├── index.html           # Homepage
│   ├── question.html        # Question detail page
│   └── admin.html          # Admin panel
├── src/css/
│   └── tailwind.css        # Tailwind source
├── cred.json              # Firebase service account key
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `cred.json` in the root directory

### 3. Environment Variables
Create a `.env` file or set environment variables:
```bash
FIREBASE_SERVICE_ACCOUNT='{your-service-account-json-here}'
PORT=3000
```

### 4. Build CSS
```bash
npm run build-css
```

### 5. Start the Server
```bash
npm start
# or for development
npm run dev
```

## Usage

### Development
1. **Build CSS** (watch mode):
   ```bash
   npm run build-css
   ```

2. **Start server** (with nodemon):
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Homepage: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Fetch all questions |
| GET | `/api/questions/:id` | Fetch single question |
| POST | `/api/add-question` | Add new question |
| PUT | `/api/questions/:id` | Update question |
| DELETE | `/api/questions/:id` | Delete question |

### Database Schema

```javascript
// Firestore collection: "questions"
{
  id: "auto-generated-id",
  title: "Question Title",
  desc: "Detailed question description",
  solutions: {
    global: "C code using global variables",
    function: "C code using functions", 
    args: "C code using arguments"
  },
  createdAt: "2025-01-XX",
  updatedAt: "2025-01-XX"
}
```

## Features in Detail

### Homepage (`/`)
- Grid display of all questions
- Real-time search functionality
- Responsive card layout with hover effects
- Dark/light mode toggle
- Loading and error states

### Question Detail (`/question/:id`)
- Tabbed interface for different solution approaches
- Syntax-highlighted code blocks
- Copy-to-clipboard functionality
- Mobile-optimized layout

### Admin Panel (`/admin`)
- Add new questions with validation
- Edit existing questions inline
- Delete questions with confirmation
- Real-time success/error notifications
- Responsive form design

## Customization

### Styling
- Modify `src/css/tailwind.css` for custom styles
- Update `tailwind.config.js` for theme customization
- Rebuild CSS with `npm run build-css`

### Database
- Update `server/services/firestoreService.js` for schema changes
- Modify validation in `server/controllers/questionsController.js`

## Production Deployment

1. **Environment Setup**:
   - Set production Firebase credentials
   - Configure proper CORS origins
   - Set NODE_ENV=production

2. **Build Assets**:
   ```bash
   npm run build-css
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper documentation
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
