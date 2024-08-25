"use client"

import { Box, Button, Stack, TextField } from "@mui/material"
import { useState } from "react"

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Greetings! I am your Game of Thrones support maester. What is it you need to know? I’m here to help.`
    }
  ])

  const [message, setMessage] = useState('')

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

  return (
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
        border="1px solid black"
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
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
