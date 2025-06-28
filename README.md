# Resume Editor Pro

A full-stack web application for creating and editing resumes with AI-powered enhancement features.

## 🚀 Features

### Frontend (React.js)
- **File Upload**: Upload PDF or DOCX files with mock parsing
- **Resume Editor**: Edit personal info, experience, education, and skills
- **AI Enhancement**: Enhance each section with AI-powered suggestions
- **Real-time Updates**: Live editing with immediate feedback
- **Save & Download**: Save resumes and download as JSON
- **Responsive Design**: Works seamlessly on desktop and mobile

### Backend (FastAPI)
- **AI Enhancement API**: Mock AI service for improving resume content
- **Resume Storage**: Save resumes to memory and local files
- **CORS Support**: Secure cross-origin requests from frontend
- **Error Handling**: Comprehensive error handling and validation
- **Health Checks**: API health monitoring endpoints

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Axios for HTTP requests
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- FastAPI
- Python 3.8+
- Pydantic for data validation
- Uvicorn ASGI server

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-editor
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the frontend (localhost:5173) and backend (localhost:8000) servers concurrently.

### Manual Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## 🎯 Usage

### Getting Started
1. **Upload Resume**: Drag and drop a PDF/DOCX file or click to browse
2. **Start from Scratch**: Create a new resume using the guided form
3. **Edit Sections**: Navigate through Personal Info, Experience, Education, and Skills
4. **Enhance with AI**: Click "Enhance with AI" buttons to improve content
5. **Save & Download**: Save your resume and download as JSON

### API Endpoints

#### POST /ai-enhance
Enhance resume section content with AI
```json
{
  "section": "experience",
  "content": "Worked on web development projects"
}
```

#### POST /save-resume
Save complete resume data
```json
{
  "personalInfo": {...},
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

#### GET /health
Health check endpoint

#### GET /saved-resumes
Retrieve all saved resumes (development)

## 🎨 Design Features

- **Modern UI**: Clean, professional design with subtle animations
- **Color System**: Consistent primary blue (#3b82f6) theme
- **Responsive Layout**: Mobile-first design with breakpoints
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Accessibility**: WCAG-compliant contrast ratios and keyboard navigation

## 🧪 Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend Development
- **Auto-reload**: Backend automatically reloads on code changes
- **API Documentation**: Available at http://localhost:8000/docs
- **Interactive API**: Test endpoints at http://localhost:8000/redoc

### Environment Variables
Create `.env` files for environment-specific settings:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
```

**Backend (.env)**
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📁 Project Structure

```
resume-editor/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── resume/       # Resume section components
│   │   │   ├── Header.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── ...
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── main.py              # Main application
│   ├── requirements.txt     # Python dependencies
│   └── saved_resumes/       # Saved resume files
├── package.json             # Root package.json
└── README.md
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Tailwind CSS
The frontend uses a custom Tailwind configuration with:
- Custom color palette
- Animation utilities
- Component classes
- Responsive breakpoints

### FastAPI Settings
- CORS middleware for cross-origin requests
- Pydantic models for request/response validation
- Automatic API documentation
- Error handling middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Ensure backend is running on port 8000
- Check CORS settings in backend/main.py
- Verify API_BASE_URL in frontend/src/services/api.js

**File upload not working:**
- Check file size limits (10MB max)
- Verify supported file types (PDF, DOC, DOCX)
- Ensure proper file validation

**AI enhancement not working:**
- Verify backend endpoint is accessible
- Check network requests in browser dev tools
- Ensure section content is not empty

### Development Tips

- Use browser dev tools to debug API requests
- Check backend logs for error details
- Use React DevTools for component debugging
- Test API endpoints using FastAPI docs at `/docs`

## 📞 Support

For questions or issues, please:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

---

Built with ❤️ using React.js and FastAPI