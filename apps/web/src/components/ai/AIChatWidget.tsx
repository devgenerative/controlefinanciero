"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Bot, Loader2 } from "lucide-react"
import { useAI } from "@/hooks/use-ai"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
      { role: 'assistant', content: 'Olá! Como posso ajudar você com suas finanças hoje?' }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { chat } = useAI()

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
      if (!input.trim()) return

      const userMsg = input
      setInput("")
      setMessages(prev => [...prev, { role: 'user', content: userMsg }])
      
      try {
          const res = await chat.mutateAsync({ message: userMsg })
          setMessages(prev => [...prev, { role: 'assistant', content: res.response }])
      } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive um problema. Tente novamente." }])
      }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
         <Button 
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setOpen(true)}
         >
             <MessageCircle className="h-8 w-8 text-white" />
         </Button> 
      )}

      {open && (
          <Card className="w-[350px] sm:w-[500px] shadow-xl border-primary/20 animate-in slide-in-from-bottom-5">
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        Assistente Financeiro
                    </CardTitle>
                    <CardDescription>Pergunte sobre seus gastos ou peça dicas.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4" ref={scrollRef as any}>
                          {messages.map((m, i) => (
                              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                      {m.content}
                                  </div>
                              </div>
                          ))}
                          {chat.isPending && (
                              <div className="flex justify-start">
                                  <div className="bg-muted rounded-lg p-3 flex items-center">
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Digitando...
                                  </div>
                              </div>
                          )}
                      </div>
                  </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                  <form 
                      className="flex w-full items-center space-x-2"
                      onSubmit={(e) => {
                          e.preventDefault()
                          handleSend()
                      }}
                  >
                      <Input 
                        placeholder="Digite sua mensagem..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={chat.isPending}
                      />
                      <Button type="submit" size="icon" disabled={chat.isPending || !input}>
                          <Send className="h-4 w-4" />
                      </Button>
                  </form>
              </CardFooter>
          </Card>
      )}
    </div>
  )
}
