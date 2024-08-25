"use client"

import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useState, useRef, useEffect } from "react"

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome to the Iron Throne of Knowledge, seeker of wisdom! I am here to provide counsel on the toughest and most cunning characters of Game of Thrones. What knowledge do you seek? `
    }
  ])

  const [message, setMessage] = useState('')

  // Create a ref for the messages container
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    setMessages(prevMessages => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ])

    setMessage("")

    try {
      const res = await fetch('/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ""

      const processText = async ({ done, value }) => {
        if (done) {
          return
        }

        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1]
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: (lastMessage.content || "") + text },
          ]
        })

        await reader.read().then(processText)
      }

      await reader.read().then(processText)

    } catch (error) {
      console.error('Error during fetch:', error)
    }
  }

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      <Box sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        color: "#c0c0c0",
        fontFamily: "Trajan Pro, serif",
        textShadow: "5px 10px 12px #786262",
        fontWeight: "bold",
        fontSize: "2rem",
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
      >
        <Typography variant="h1" gutterBottom>
          Rate My Maester
        </Typography>
        <Typography
          variant="h5"
          gutterBottom>
          Endurance of the Realm: Who Reigns Supreme in Surviving the Game of Thrones?
        </Typography>
      </Box>

      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid #808080"
          p={2}
          spacing={3}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="row"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            {/* Ref element to scroll into view */}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction={'row'} spacing={2} border="1px solid #808080"
          >
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ '& .MuiInputBase-input': { color: 'white' } }}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
