import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../component/Navbar'

function ChatBot() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/hello')
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage("Error connecting to backend")
        console.error(err)
      })
  }, [])

  return (
    <div>
      <Navbar />
      <h1>Frontend - React + Vite</h1>
      <p>Backend says: {message}</p>
    </div>
  )
}

export default ChatBot