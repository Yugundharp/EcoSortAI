# 🌱 EcoSortAI – Smart Waste Classification and Recycling Assistant

A full-stack AI-powered application for waste classification and recycling guidance, built with React 19, FastAPI, TensorFlow, and Google Gemini AI.

## 📋 Project Overview

EcoSortAI helps users classify waste items using a CNN image classifier and provides intelligent explanations and recycling guidance through Gemini AI integration. This project supports Canadian 2026 sustainability goals by automating waste sorting and promoting proper recycling practices.

## 🏗️ Architecture

```
┌─────────────────┐
│  React 19 + Vite │  (Frontend - Port 3000)
│  TypeScript      │
│  Chakra UI       │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   FastAPI       │  (Backend - Port 8000)
│   Python        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│TensorFlow│ │  Gemini AI │
│  CNN    │ │  (API)      │
└────────┘ └──────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **TensorFlow** 2.15+
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Train the model (optional - if you have a dataset):**
   ```bash
   cd ../model
   python train_model.py
   ```
   Note: You'll need a dataset organized as:
   ```
   data/
     ├── Paper/
     ├── Plastic/
     ├── Metal/
     ├── Glass/
     └── Compost/
   ```

6. **Run the backend:**
   ```bash
   cd ../backend
   uvicorn main:app --reload
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
EcoSortAI/
├── frontend/                 # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── common/          # Reusable components
│   │   │   ├── ButtonPrimary.tsx
│   │   │   ├── CardContainer.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── ErrorToast.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── UploadPage.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   ├── ChatbotPage.tsx
│   │   │   └── MetricsPage.tsx
│   │   ├── services/        # API client
│   │   │   └── api.ts
│   │   ├── theme/           # Chakra UI theme
│   │   │   └── theme.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── metrics.json
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # FastAPI + TensorFlow
│   ├── routers/             # API route handlers
│   │   ├── predict.py
│   │   ├── gen.py
│   │   └── chat.py
│   ├── models/              # Trained CNN model
│   │   └── recycler_cnn.h5
│   ├── utils/               # Utility functions
│   │   ├── gemini_client.py
│   │   └── image_preprocess.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── predict_schema.py
│   │   └── gen_schema.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── model/                   # Model training
│   └── train_model.py
│
└── README.md
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok"
}
```

### Image Classification
```http
POST /api/predict
Content-Type: multipart/form-data
```
**Request:** Form data with `file` field (image file)  
**Response:**
```json
{
  "class": "Plastic",
  "confidence": 0.95
}
```

### Get Explanation
```http
POST /api/gen/explain
Content-Type: application/json
```
**Request:**
```json
{
  "category": "Plastic",
  "confidence": 0.95
}
```
**Response:**
```json
{
  "explanation": "This item is classified as Plastic with 95% confidence. In Canada, plastic items can typically be recycled through municipal recycling programs..."
}
```

### Chat with AI
```http
POST /api/chat
Content-Type: application/json
```
**Request:**
```json
{
  "message": "How do I recycle plastic bottles?"
}
```
**Response:**
```json
{
  "reply": "In Canada, plastic bottles can be recycled through your municipal recycling program..."
}
```

## 🧠 Model Architecture

The CNN model uses the following architecture:

- **Input:** 128×128 RGB images
- **Convolutional Layers:** 3 Conv2D layers (32, 64, 128 filters) with ReLU activation
- **Pooling:** MaxPooling2D after each convolutional layer
- **Regularization:** Dropout (0.25) after each pooling layer
- **Dense Layers:** 256-unit fully connected layer with dropout (0.5)
- **Output:** 5-class softmax (Paper, Plastic, Metal, Glass, Compost)

## 🎨 Features

### Frontend
- ✨ Modern UI with Chakra UI
- 📸 Drag-and-drop image upload
- 📊 Real-time classification results
- 💬 Interactive Gemini chatbot
- 📈 Model metrics visualization (accuracy, loss, confusion matrix)
- ♿ Accessible and responsive design

### Backend
- 🚀 FastAPI REST API
- 🤖 TensorFlow CNN for image classification
- 🧠 Gemini AI integration for explanations and chat
- 📝 Pydantic schemas for validation
- 🔒 CORS middleware for frontend integration

## 🛠️ Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 📊 Rubric Coverage

| Rubric Item           | Implementation                          |
| --------------------- | --------------------------------------- |
| TensorFlow Model      | CNN image classifier (`model/train_model.py`) |
| Gemini Integration    | Natural-language explanation + chatbot (`backend/utils/gemini_client.py`) |
| Backend API           | FastAPI REST endpoints (`backend/routers/`) |
| Frontend              | React 19 + Vite (TypeScript + Chakra UI) |
| Canadian 2026 Context | Recycling automation supports sustainability goals |
| Innovation            | AI explanation + chatbot + real-time image upload |
| Presentation          | Visually strong demo (image → result → chat) |

## 🔑 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend
Create `.env` file in `frontend/` directory:
```
VITE_API_URL=http://localhost:8000
```

## 📝 Notes

- The model file (`recycler_cnn.h5`) must be trained and placed in `backend/models/` before running predictions
- For training, you can use datasets like:
  - [TrashNet](https://github.com/garythung/trashnet)
  - Toronto Waste Dataset
  - Custom organized dataset
- Ensure your dataset is organized in folders by class name

## 🤝 Contributing

This is a group project for COMP-258 Neural Networks course.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- TensorFlow for deep learning framework
- Google Gemini for AI explanations
- Chakra UI for beautiful components
- FastAPI for high-performance API framework

---

**Built with ❤️ for Canadian 2026 Sustainability Goals**

