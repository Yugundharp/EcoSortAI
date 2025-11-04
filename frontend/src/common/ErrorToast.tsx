import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

interface ErrorToastProps {
  error: string | null
  onClose?: () => void
}

export const ErrorToast = ({ error, onClose }: ErrorToastProps) => {
  const toast = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      onClose?.()
    }
  }, [error, toast, onClose])

  return null
}

