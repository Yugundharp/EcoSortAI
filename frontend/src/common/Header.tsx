import { Box, Flex, Heading, Link, HStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

export const Header = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Upload' },
    { path: '/chatbot', label: 'Chatbot' },
    { path: '/metrics', label: 'Metrics' },
  ]

  return (
    <Box
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Heading size="lg" color="eco.600">
          🌱 EcoSortAI
        </Heading>
        <HStack spacing={6}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              as={RouterLink}
              to={link.path}
              color={location.pathname === link.path ? 'eco.600' : 'gray.600'}
              fontWeight={location.pathname === link.path ? 'semibold' : 'normal'}
              _hover={{ color: 'eco.500' }}
              textDecoration="none"
            >
              {link.label}
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  )
}

