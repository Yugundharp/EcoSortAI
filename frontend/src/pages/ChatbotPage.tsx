import { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  Avatar,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { CardContainer } from '../common/CardContainer'
import { sendChatMessage } from '../services/api'
import { useToast } from '@chakra-ui/react'

interface Message {
  role: 'user' | 'bot'
  content: string
}

export const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hello! I'm your recycling assistant. Ask me anything about waste classification, recycling tips, or sustainability!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const bgUser = useColorModeValue('eco.100', 'eco.700')
  const bgBot = useColorModeValue('gray.100', 'gray.700')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await sendChatMessage(userMessage)
      setMessages((prev) => [...prev, { role: 'bot', content: response.reply }])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || error.message || 'Failed to send message',
        status: 'error',
        duration: 5000,
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box maxW="900px" mx="auto" px={4} py={8}>
      <CardContainer title="Recycling Chatbot">
        <VStack spacing={4} align="stretch" h="600px">
          <Box
            flex="1"
            overflowY="auto"
            p={4}
            bg={useColorModeValue('gray.50', 'gray.900')}
            borderRadius="md"
          >
            <VStack spacing={4} align="stretch">
              {messages.map((msg, idx) => (
                <Flex
                  key={idx}
                  justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                  align="flex-start"
                  gap={3}
                >
                  {msg.role === 'bot' && (
                    <Avatar size="sm" bg="eco.500" name="AI" />
                  )}
                  <Box
                    maxW="70%"
                    p={3}
                    borderRadius="lg"
                    bg={msg.role === 'user' ? bgUser : bgBot}
                  >
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {msg.content}
                    </Text>
                  </Box>
                  {msg.role === 'user' && (
                    <Avatar size="sm" bg="ocean.500" name="You" />
                  )}
                </Flex>
              ))}
              {isLoading && (
                <Flex justify="flex-start" align="flex-start" gap={3}>
                  <Avatar size="sm" bg="eco.500" name="AI" />
                  <Box p={3} borderRadius="lg" bg={bgBot}>
                    <Text fontSize="sm" color="gray.600">
                      Thinking...
                    </Text>
                  </Box>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <HStack>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about recycling, waste classification, or sustainability..."
              disabled={isLoading}
              borderRadius="md"
            />
            <ButtonPrimary onClick={handleSend} isLoading={isLoading} disabled={!input.trim()}>
              Send
            </ButtonPrimary>
          </HStack>
        </VStack>
      </CardContainer>
    </Box>
  )
}

