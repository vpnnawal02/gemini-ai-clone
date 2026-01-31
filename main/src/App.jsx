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

  const handlePromptClick = (promptText) => {
    setInput(promptText);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex">

      {/* Main Content */}
      <main className="flex-1 flex flex-col">

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-4xl mx-auto space-y-8 sm:space-y-12">

            {/* Greeting Section - Always visible */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Hi there, <span className="text-purple-600">Vipin</span>
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700">
                What would <span className="text-purple-600">like to know?</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 pt-2">
                Use one of the most common prompts below or use your own to begin
              </p>
            </div>

            {/* Prompt Cards - Only show when no messages */}
            {messages.length === 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 h-[20vh]">
                  <button
                    onClick={() => handlePromptClick("Write a to-do list for building a full-stack EdTech platform")}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-left transition-all hover:shadow-md hover:border-purple-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mb-3 group-hover:bg-purple-100 transition">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-snug">
                      Write a to-do list for a personal project or task
                    </p>
                  </button>

                  <button
                    onClick={() => handlePromptClick("Generate an email reply to a job offer")}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-left transition-all hover:shadow-md hover:border-purple-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mb-3 group-hover:bg-purple-100 transition">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-snug">
                      Generate an email reply to a job offer
                    </p>
                  </button>

                  <button
                    onClick={() => handlePromptClick("Summarise this article or text for me in one paragraph")}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-left transition-all hover:shadow-md hover:border-purple-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mb-3 group-hover:bg-purple-100 transition">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-snug">
                      Summarise this article or text for me in one paragraph
                    </p>
                  </button>

                  <button
                    onClick={() => handlePromptClick("How does AI work in a technical capacity")}
                    className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 text-left transition-all hover:shadow-md hover:border-purple-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mb-3 group-hover:bg-purple-100 transition">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-snug">
                      How does AI work in a technical capacity
                    </p>
                  </button>
                </div>
              </>
            )}

            {/* Chat Messages */}
            {messages.length > 0 && (
              <div className="space-y-4 sm:space-y-6 mt-8">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {msg.role !== "user" && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md flex-shrink-0">
                        AI
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[70%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm md:text-base leading-relaxed shadow-md ${msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md flex-shrink-0">
                        V
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                      AI
                    </div>
                    <div className="bg-white shadow-md px-4 py-3 rounded-2xl text-sm flex gap-1 border border-gray-100">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Search Input Box at Bottom */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-t from-purple-50/80 to-transparent">
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask whatever you want..."
                  className="flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    All Web
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="hidden sm:inline">Add Attachment</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Use Image</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{input.length}/1000</span>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
