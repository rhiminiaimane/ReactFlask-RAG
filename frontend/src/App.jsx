import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import ChatBot from './pages/ChatBot'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<ChatBot />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;