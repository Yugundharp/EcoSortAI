import { useState, useCallback } from 'react'
import {
  Box,
  VStack,
  Text,
  Image,
  useToast,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { CardContainer } from '../common/CardContainer'
import { Loader } from '../common/Loader'
import { predictImage, getExplanation } from '../services/api'

export const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<{ class: string; confidence: number } | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const toast = useToast()
  const navigate = useNavigate()
  const borderColor = useColorModeValue('gray.300', 'gray.600')

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setPrediction(null)
      setExplanation(null)
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        status: 'error',
        duration: 3000,
      })
    }
  }, [toast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleClassify = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image first',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await predictImage(selectedFile)
      setPrediction(result)

      // Get explanation from Gemini
      const explainResult = await getExplanation(result.class, result.confidence)
      setExplanation(explainResult.explanation)
    } catch (error: any) {
      toast({
        title: 'Classification failed',
        description: error.response?.data?.detail || error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="800px" mx="auto" px={4} py={8}>
      <VStack spacing={6}>
        <CardContainer title="Upload Waste Image">
          <VStack spacing={4}>
            <Box
              w="100%"
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              _hover={{ borderColor: 'eco.400', bg: 'eco.50' }}
              transition="all 0.2s"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%' }}>
                <VStack spacing={2}>
                  <Text fontSize="lg" color="gray.600">
                    📸 Drag and drop an image here, or click to select
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Supported formats: JPG, PNG, GIF
                  </Text>
                </VStack>
              </label>
            </Box>

            {preview && (
              <Box w="100%" mt={4}>
                <Image
                  src={preview}
                  alt="Preview"
                  maxH="300px"
                  mx="auto"
                  borderRadius="md"
                  boxShadow="md"
                />
              </Box>
            )}

            <ButtonPrimary
              onClick={handleClassify}
              isLoading={isLoading}
              loadingText="Classifying..."
              disabled={!selectedFile || isLoading}
              w="100%"
            >
              Classify Waste
            </ButtonPrimary>
          </VStack>
        </CardContainer>

        {isLoading && <Loader message="Analyzing image with AI..." />}

        {prediction && !isLoading && (
          <CardContainer title="Classification Result">
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Category: {prediction.class}
                </Text>
                <Progress
                  value={prediction.confidence * 100}
                  colorScheme="eco"
                  size="lg"
                  borderRadius="md"
                />
                <Text fontSize="sm" color="gray.600" mt={2}>
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </Text>
              </Box>

              {explanation && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>AI Explanation</AlertTitle>
                    <AlertDescription mt={2}>{explanation}</AlertDescription>
                  </Box>
                </Alert>
              )}

              <ButtonPrimary
                onClick={() => navigate('/chatbot')}
                variant="outline"
                colorScheme="ocean"
              >
                Ask Questions About Recycling
              </ButtonPrimary>
            </VStack>
          </CardContainer>
        )}
      </VStack>
    </Box>
  )
}

