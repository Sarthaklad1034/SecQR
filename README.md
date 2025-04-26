# SecQR - Secure QR Code Scanning with AI

SecQR is an AI-powered QR code scanner that identifies and warns users about malicious URLs. It uses a combination of machine learning and a database of known URLs to determine the safety of a link. If the URL is flagged as dangerous, the user is immediately alerted. Additionally, SecQR leverages database overrides to ensure that AI predictions are accurate, with safe or malicious URLs categorized and checked against the database.

![SecQR Banner](https://i.ibb.co/s9qJ3b1V/Wallet-Scope-1.png)

---

## 🚀 Features

- **Real-time QR Code Scanning**: Scan QR codes using your device's camera
- **AI-Powered URL Analysis**: Detect potentially malicious URLs using machine learning
- **Database Verification**: Cross-reference URLs with known safe/malicious databases
- **Instant Alerts**: Get immediate notification about dangerous URLs
- **Detailed Reports**: View comprehensive analysis results for scanned URLs
- **Mobile-Responsive Design**: Works seamlessly on mobile and desktop devices

## 🛠️ Tech Stack

### Frontend
- React.js for UI components
- Axios for API requests
- React Router for navigation

### Backend
- Flask Python framework
- MongoDB for URL database
- Scikit-learn for machine learning model

### Machine Learning
- Random Forest classifier
- Feature extraction for URL analysis
- Pre-trained model (.pkl format)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/secqr.git
cd secqr
```

2. Set up backend environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configure your environment variables
```

3. Set up frontend environment
```bash
cd ../frontend
npm install
cp .env.example .env  # Configure your environment variables
```

4. Configure environment variables
   - Backend `.env`: Add your MongoDB connection string, API keys, etc.
   - Frontend `.env`: Add your API endpoint

### Running the Application

1. Start the backend server
```bash
cd backend
python app.py
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

---

## 🗂️ Project Structure

### Frontend Structure
- `components/`: Reusable UI components
- `pages/`: Application pages
- `services/`: API connection services
- `assets/`: Images, CSS, and other static assets

### Backend Structure
- `routes/`: API endpoints
- `services/`: Business logic services
- `models/`: Machine learning model
- `utils/`: Helper functions

## </> API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scan` | POST | Decode QR code image and analyze URL |
| `/api/checksafe-url` | POST | Analyze a safe URL directly |
| `/api/checkmalicious-url` | POST | Analyze a malicious URL directly |

## 🧠 Machine Learning Model

The URL classifier is trained on a dataset of both safe and malicious URLs. It extracts features such as:
- URL length
- Domain age and reputation
- Special character frequency
- TLD analysis
- Path analysis

The model file is stored in `backend/models/url_classifier.pkl` and is loaded at runtime.

## 🔜 Future Enhancements

- [ ] User authentication system
- [ ] History of scanned QR codes
- [ ] Browser extension
- [ ] Offline scanning capabilities
- [ ] Advanced threat intelligence integration

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🪪 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 📞 Contact

Linkedin Link: [Sarthak Lad](https://www.linkedin.com/in/sarthak-lad/)

Project Link: [Sarthaklad1034/SecQR](https://github.com/Sarthaklad1034/SecQR.git)
