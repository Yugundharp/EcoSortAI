import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface PredictionResponse {
  class: string  // Backend uses alias "class" for class_name
  confidence: number
}

export interface ExplanationResponse {
  explanation: string
}

export interface ChatResponse {
  reply: string
}

export interface HealthResponse {
  status: string
}

/**
 * Upload image and get prediction from CNN model
 */
export const predictImage = async (imageFile: File): Promise<PredictionResponse> => {
  const formData = new FormData()
  formData.append('file', imageFile)
  
  const response = await apiClient.post<PredictionResponse>('/api/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}

/**
 * Get Gemini explanation for predicted category
 */
export const getExplanation = async (
  category: string,
  confidence: number
): Promise<ExplanationResponse> => {
  const response = await apiClient.post<ExplanationResponse>('/api/gen/explain', {
    category,
    confidence,
  })
  
  return response.data
}

/**
 * Send message to Gemini chatbot
 */
export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/api/chat', {
    message,
  })
  
  return response.data
}

/**
 * Check backend health
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/api/health')
  return response.data
}

export default apiClient

