# 🚀 EcoSortAI Setup Guide

Follow these steps to get your EcoSortAI project up and running.

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

1. Copy the template file:
   ```bash
   copy env_template.txt .env  # Windows
   # or
   cp env_template.txt .env    # macOS/Linux
   ```

2. Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

### 1.3 Train the Model (Optional)

If you have a dataset, train the model:

```bash
cd ../model
python train_model.py
```

**Dataset Structure Required:**
```
data/
  ├── Paper/
  │   ├── image1.jpg
  │   ├── image2.jpg
  │   └── ...
  ├── Plastic/
  ├── Metal/
  ├── Glass/
  └── Compost/
```

**Recommended Datasets:**
- [TrashNet](https://github.com/garythung/trashnet)
- Toronto Waste Dataset
- Custom organized dataset

**Note:** If you don't train a model, you'll need to place a pre-trained `recycler_cnn.h5` file in `backend/models/`

### 1.4 Run Backend

```bash
cd ../backend
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

## Step 2: Frontend Setup

### 2.1 Install Node Dependencies

```bash
cd frontend
npm install
```

### 2.2 Configure Environment (Optional)

Create `frontend/.env` if you need to change the API URL:
```
VITE_API_URL=http://localhost:8000
```

### 2.3 Run Frontend

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Step 3: Verify Installation

1. **Check Backend Health:**
   - Visit: `http://localhost:8000/api/health`
   - Should return: `{"status": "ok"}`

2. **Check Frontend:**
   - Visit: `http://localhost:3000`
   - You should see the EcoSortAI homepage

3. **Test Image Classification:**
   - Upload an image on the Upload page
   - Should get a prediction result

4. **Test Chatbot:**
   - Go to Chatbot page
   - Ask a question about recycling
   - Should get a response from Gemini AI

---

## Troubleshooting

### Backend Issues

**Error: Model file not found**
- Solution: Train the model or place `recycler_cnn.h5` in `backend/models/`

**Error: GEMINI_API_KEY not found**
- Solution: Create `.env` file in `backend/` with your API key

**Error: Module not found**
- Solution: Make sure virtual environment is activated and run `pip install -r requirements.txt`

### Frontend Issues

**Error: Cannot connect to backend**
- Solution: Ensure backend is running on port 8000
- Check `VITE_API_URL` in `frontend/.env`

**Error: npm install fails**
- Solution: Try `npm install --legacy-peer-deps`
- Or update Node.js to version 18+

### Model Training Issues

**Error: No images found**
- Solution: Check dataset directory structure matches required format
- Ensure images are in JPG, PNG, or JPEG format

**Error: Out of memory**
- Solution: Reduce batch size in `train_model.py` (change `BATCH_SIZE = 32` to `BATCH_SIZE = 16`)

---

## Project Structure Quick Reference

```
EcoSortAI/
├── frontend/          # React app (port 3000)
├── backend/           # FastAPI app (port 8000)
├── model/             # Training scripts
└── README.md          # Main documentation
```

---

## Next Steps

1. ✅ Backend running on port 8000
2. ✅ Frontend running on port 3000
3. ✅ Model trained or pre-trained model added
4. ✅ Gemini API key configured
5. 🎉 Ready to use EcoSortAI!

For more details, see [README.md](README.md)

