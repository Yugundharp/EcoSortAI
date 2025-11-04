import { Box, Text, Flex } from '@chakra-ui/react'

export const Footer = () => {
  return (
    <Box
      as="footer"
      bg="gray.800"
      color="gray.300"
      py={6}
      mt="auto"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        maxW="1200px"
        mx="auto"
        px={6}
      >
        <Text fontSize="sm" mb={2}>
          EcoSortAI - Smart Waste Classification and Recycling Assistant
        </Text>
        <Text fontSize="xs" color="gray.500">
          Built with React 19, FastAPI, TensorFlow, and Gemini AI
        </Text>
        <Text fontSize="xs" color="gray.500" mt={2}>
          Supporting Canadian 2026 Sustainability Goals
        </Text>
      </Flex>
    </Box>
  )
}

