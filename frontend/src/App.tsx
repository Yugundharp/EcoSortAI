import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { Header } from './common/Header'
import { Footer } from './common/Footer'
import { UploadPage } from './pages/UploadPage'
import { ResultPage } from './pages/ResultPage'
import { ChatbotPage } from './pages/ChatbotPage'
import { MetricsPage } from './pages/MetricsPage'

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex="1" py={4}>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  )
}

export default App

