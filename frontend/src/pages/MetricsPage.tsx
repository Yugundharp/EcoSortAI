// metricscomments

import { useState, useEffect } from 'react'
import { Box, VStack, Text, SimpleGrid } from '@chakra-ui/react'
import { CardContainer } from '../common/CardContainer'
import { Loader } from '../common/Loader'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricsData {
  accuracy: number
  loss: number
  confusionMatrix: {
    labels: string[]
    data: number[][]
  }
  trainingHistory: {
    epoch: number
    accuracy: number
    loss: number
    val_accuracy: number
    val_loss: number
  }[]
}

export const MetricsPage = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load metrics from JSON file (generated during training)
    fetch('/metrics.json')
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <Box maxW="1200px" mx="auto" px={4} py={8}>
        <Loader message="Loading metrics..." />
      </Box>
    )
  }

  if (!metrics || metrics.trainingHistory.length === 0 || metrics.confusionMatrix.data.length === 0) {
    return (
      <Box maxW="1200px" mx="auto" px={4} py={8}>
        <CardContainer title="Metrics">
          <VStack gap={4} align="stretch">
            <Text>Metrics data not available. Please train the model first.</Text>
            <Text fontSize="sm" color="gray.600">
              The metrics page will display training history, accuracy charts, and confusion matrix once the model has been trained.
            </Text>
          </VStack>
        </CardContainer>
      </Box>
    )
  }

  // Prepare confusion matrix data for visualization
  const confusionMatrixData = metrics.confusionMatrix.labels.map((label, idx) => {
    const rowData: Record<string, number | string> = { name: label }
    if (metrics.confusionMatrix.data[idx] && metrics.confusionMatrix.data[idx].length > 0) {
      metrics.confusionMatrix.data[idx].forEach((val, i) => {
        rowData[metrics.confusionMatrix.labels[i]] = val
      })
    }
    return rowData
  })

  // Prepare training history data
  const trainingHistoryData = metrics.trainingHistory.map((epoch) => ({
    epoch: epoch.epoch,
    accuracy: epoch.accuracy,
    loss: epoch.loss,
    val_accuracy: epoch.val_accuracy,
    val_loss: epoch.val_loss,
  }))

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <VStack gap={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="100%">
          <CardContainer title="Model Accuracy">
            <VStack align="start" gap={2}>
              <Text fontSize="sm" color="gray.600">Overall Accuracy</Text>
              <Text fontSize="3xl" fontWeight="bold" color="eco.600">
                {(metrics.accuracy * 100).toFixed(2)}%
              </Text>
              <Text fontSize="xs" color="gray.500">CNN Classification Performance</Text>
            </VStack>
          </CardContainer>

          <CardContainer title="Model Loss">
            <VStack align="start" gap={2}>
              <Text fontSize="sm" color="gray.600">Final Loss</Text>
              <Text fontSize="3xl" fontWeight="bold" color="eco.600">
                {metrics.loss.toFixed(4)}
              </Text>
              <Text fontSize="xs" color="gray.500">Lower is better</Text>
            </VStack>
          </CardContainer>
        </SimpleGrid>

        <CardContainer title="Training History">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#22c55e" name="Training Accuracy" />
              <Line type="monotone" dataKey="val_accuracy" stroke="#16a34a" name="Validation Accuracy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContainer>

        <CardContainer title="Loss History">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="loss" stroke="#ef4444" name="Training Loss" />
              <Line type="monotone" dataKey="val_loss" stroke="#dc2626" name="Validation Loss" />
            </LineChart>
          </ResponsiveContainer>
        </CardContainer>

        <CardContainer title="Confusion Matrix">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={confusionMatrixData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.confusionMatrix.labels.map((label, idx) => (
                <Bar
                  key={label}
                  dataKey={label}
                  fill={`hsl(${idx * 60}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContainer>
      </VStack>
    </Box>
  )
}

