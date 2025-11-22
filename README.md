# 🎓 Smart Classroom Attendance System

> AI-powered attendance system with real-time face recognition and anti-spoofing detection

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 🌟 Features

### 🎯 Core Functionality
- **Automated Attendance**: Multi-face detection and recognition in real-time
- **Anti-Spoofing**: Detects static photos/videos attempting to fake attendance
- **Multi-Photo Support**: Store multiple photos per student (different angles, with/without glasses)
- **Real-time Monitoring**: Live camera feed with WebSocket streaming
- **Smart Alerts**: Automatic notifications for suspicious behavior

### 📊 Management & Analytics
- **Student Management**: Add, edit, delete students with multiple photos
- **Attendance Dashboard**: Real-time and historical attendance tracking
- **Statistics & Reports**: Comprehensive analytics and CSV export
- **Suspicious Activity Log**: Track and resolve spoofing attempts

### 🔐 Security
- **JWT Authentication**: Secure login with role-based access control
- **Movement Detection**: Monitors natural head movements
- **Liveness Scoring**: Calculates suspicion scores based on behavior
- **Activity Logging**: Complete audit trail of all suspicious activities

## 🏗️ Architecture

```
Frontend (React) ←→ Backend API (FastAPI) ←→ Database (MongoDB)
                          ↓
                  Face Recognition (DeepFace)
                          ↓
                  Camera Feed (OpenCV)
```

## 📁 Project Structure

```
smart-classroom-attendance/
├── backend/                    # FastAPI REST API
│   ├── main.py                # Main application
│   ├── auth.py                # Authentication module
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── docker-compose.yml    # Multi-container setup
│
├── frontend/                  # React frontend (separate repo)
│
├── database_mongo.py          # MongoDB database module
├── setup_database_mongo.py    # Database setup script
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- MongoDB (local or Atlas)
- Docker (optional)
- Node.js 16+ (for frontend)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd smart-classroom-attendance
```

### 2. Setup Backend

#### Option A: Using Docker (Recommended)

```bash
cd backend
docker-compose up -d
```

#### Option B: Local Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URI
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Create Admin User

```bash
cd backend
python create_admin.py
```

### 4. Add Students

```bash
python setup_database_mongo.py
```

### 5. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login and get JWT token
GET  /api/auth/me          # Get current user info
```

### Student Management

```
GET    /api/students              # Get all students
POST   /api/students              # Create student
GET    /api/students/{id}         # Get student details
PUT    /api/students/{id}         # Update student
DELETE /api/students/{id}         # Delete student
POST   /api/students/{id}/photos  # Upload photo
```

### Attendance

```
GET  /api/attendance/today        # Today's attendance
GET  /api/attendance/date/{date}  # Attendance by date
POST /api/attendance/entry        # Mark entry
POST /api/attendance/exit         # Mark exit
```

### Real-time Monitoring

```
WS /ws/camera  # WebSocket for live camera feed
```

## 🔧 Configuration

### Environment Variables

Create `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/

# JWT
JWT_SECRET_KEY=your-super-secret-key

# API
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend Configuration

Update `frontend/src/config.ts`:

```typescript
export const API_URL = "http://localhost:8000";
```

## 🎯 How It Works

### Attendance Flow

1. **Camera captures frame** → OpenCV processes image
2. **Face detection** → Haar Cascade detects faces
3. **Face recognition** → DeepFace matches against database
4. **Liveness check** → Monitors movement patterns
5. **Attendance logging** → Records entry/exit times
6. **Alert generation** → Flags suspicious behavior

### Anti-Spoofing Detection

```
Movement Tracking → Variance Calculation → Suspicion Score
                                              ↓
                                    Score > Threshold?
                                              ↓
                                    Issue Challenge
                                              ↓
                                    Monitor Response
                                              ↓
                                    Verify or Flag
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **OpenCV**: Computer vision and face detection
- **DeepFace**: Face recognition (VGG-Face model)
- **PyMongo**: MongoDB driver
- **JWT**: Authentication
- **WebSockets**: Real-time communication

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Component library

### Database
- **MongoDB**: NoSQL database
- Collections: students, student_photos, attendance, suspicious_activity, users

## 📊 Database Schema

### Students Collection
```json
{
  "student_id": "STU001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### Student Photos Collection
```json
{
  "student_id": "STU001",
  "photo_path": "/photos/students/STU001/front.jpg",
  "photo_type": "front",
  "description": "Front facing photo"
}
```

### Attendance Collection
```json
{
  "student_id": "STU001",
  "date": "2024-01-20",
  "entry_time": "2024-01-20T09:00:00Z",
  "exit_time": "2024-01-20T11:30:00Z",
  "status": "present",
  "suspicion_score": 0.2
}
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker ps

# Start MongoDB
cd backend
docker-compose up -d mongodb
```

### Camera Not Working
- Check camera permissions
- Try different camera index in code
- Ensure no other app is using camera

### Face Not Recognized
- Add multiple photos per student (3-5)
- Ensure good lighting
- Use clear, front-facing photos

## 🚀 Deployment

### Backend (Docker)
```bash
cd backend
docker-compose up -d
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Database (MongoDB Atlas)
- Use MongoDB Atlas for production
- Update connection string in `.env`

## 🔐 Security Best Practices

- ✅ Use environment variables for secrets
- ✅ Enable MongoDB authentication
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Regular security audits

## 📝 License

This project is for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🙏 Acknowledgments

- **DeepFace**: Face recognition library
- **FastAPI**: Modern Python web framework
- **MongoDB**: Flexible NoSQL database
- **OpenCV**: Computer vision library

## 📞 Support

For issues or questions:
- Check documentation
- Review API docs at `/docs`
- Open an issue on GitHub

---

**Made with ❤️ for smart classrooms**
