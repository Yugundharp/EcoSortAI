import { useLocation } from 'react-router-dom'
import { Box, VStack, Text, Progress, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { CardContainer } from '../common/CardContainer'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { useNavigate } from 'react-router-dom'

interface LocationState {
  prediction?: {
    class: string
    confidence: number
  }
  explanation?: string
}

export const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  if (!state?.prediction) {
    return (
      <Box maxW="800px" mx="auto" px={4} py={8}>
        <CardContainer title="No Result">
          <Text>No prediction result available. Please upload an image first.</Text>
          <ButtonPrimary mt={4} onClick={() => navigate('/')}>
            Go to Upload
          </ButtonPrimary>
        </CardContainer>
      </Box>
    )
  }

  const { prediction, explanation } = state

  return (
    <Box maxW="800px" mx="auto" px={4} py={8}>
      <VStack spacing={6}>
        <CardContainer title="Classification Result">
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
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

            <ButtonPrimary onClick={() => navigate('/')}>
              Classify Another Image
            </ButtonPrimary>
          </VStack>
        </CardContainer>
      </VStack>
    </Box>
  )
}

