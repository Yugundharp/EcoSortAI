import { Button, ButtonProps } from '@chakra-ui/react'

interface ButtonPrimaryProps extends ButtonProps {
  children: React.ReactNode
}

export const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <Button
      colorScheme="eco"
      size="lg"
      borderRadius="md"
      fontWeight="semibold"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  )
}

