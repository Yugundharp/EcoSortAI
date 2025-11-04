import { Spinner, Box, Text, VStack } from '@chakra-ui/react'

interface LoaderProps {
  message?: string
  size?: string
}

export const Loader = ({ message = 'Loading...', size = 'xl' }: LoaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="200px"
      w="100%"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="eco.500"
          size={size}
        />
        {message && (
          <Text color="gray.600" fontSize="sm">
            {message}
          </Text>
        )}
      </VStack>
    </Box>
  )
}

