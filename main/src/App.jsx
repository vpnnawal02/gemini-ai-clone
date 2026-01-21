import React, { useState, useRef, useEffect } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            ...messages.map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content,
            })),
            { role: "user", content: input },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI API error:", errText);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: "ai", content: aiContent }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: " + error.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen from-purple-100 via-white to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-3xl h-screen bg-white/70 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <header className="p-4 flex items-center justify-between border-b-3 border-blue-500">
          <div>
            <h1 className="text-xl font-bold">V - Chatbot</h1>
            <p className="text-sm opacity-80">Your personal AI assistant</p>
            <p className="text-sm opacity-80">Powered by gpt-4o-mini</p>
          </div>
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
            V-AI
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {/* AI Avatar */}
              {msg.role !== "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
              )}

              {/* Bubble */}
              <div
                className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="bg-white shadow px-4 py-3 rounded-2xl text-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 p-1 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows="2"
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="h-12 px-6 bg-blue-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition font-medium shadow"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default App;
