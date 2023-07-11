import { useState } from "react"

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("")

  const handleUserPrompt = (e) => {
    setUserPrompt(e.target.value)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ChatGPT Clone</h1>
      
      <textarea placeholder="ask me anything" value={userPrompt} onChange={(e) => handleUserPrompt(e)} />
      
    </main>
  )
}
