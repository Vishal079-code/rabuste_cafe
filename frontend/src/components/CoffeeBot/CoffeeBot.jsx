import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CoffeeBot.css";

const CoffeeBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi ☕ I'm your Coffee Buddy! Tell me your mood and budget 😊",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/chat`, {
  message: input,
});


      const botMessage = {
        sender: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops 😔 Something went wrong!" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="coffee-bot-btn" onClick={() => setOpen(!open)}>
        ☕
      </div>

      {/* Chat Window */}
      {open && (
        <div className="coffee-bot-window">
          <div className="coffee-bot-header">
            Coffee Buddy ☕
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="coffee-bot-body">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && <div className="msg bot">Typing...</div>}
            <div ref={chatEndRef}></div>
          </div>

          <div className="coffee-bot-footer">
            <input
              type="text"
              placeholder="I'm tired, budget 150..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoffeeBot;
