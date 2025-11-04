import { Card, CardBody, CardHeader, Heading, CardProps } from '@chakra-ui/react'

interface CardContainerProps extends CardProps {
  title?: string
  children: React.ReactNode
}

export const CardContainer = ({ title, children, ...props }: CardContainerProps) => {
  return (
    <Card
      borderRadius="xl"
      boxShadow="lg"
      bg="white"
      {...props}
    >
      {title && (
        <CardHeader pb={2}>
          <Heading size="md" color="eco.700">
            {title}
          </Heading>
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
    </Card>
  )
}

