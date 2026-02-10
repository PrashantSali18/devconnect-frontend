import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { messageAPI } from "../../utils/api.js";
import {
  setMessages,
  addMessage,
  setActiveConversation,
  markMessagesAsRead,
  setTyping,
} from "../../redux/slices/chatSlice";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import useSocket from "../../hooks/useScoket.js";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { activeConversation, messages, conversations, typingUsers } =
    useSelector((state) => state.chat);
  const currentUser = useSelector(selectCurrentUser);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = conversations
    .flatMap((c) => c.participants)
    .find((p) => p._id === activeConversation);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
      markAsRead();
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages[activeConversation]]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:received", (message) => {
      if (
        message.sender === activeConversation ||
        message.receiver === activeConversation
      ) {
        dispatch(addMessage(message));
        if (message.sender === activeConversation) {
          markAsRead();
        }
      }
    });

    socket.on("typing:started", ({ senderId }) => {
      if (senderId === activeConversation) {
        dispatch(setTyping({ userId: senderId, isTyping: true }));
      }
    });

    socket.on("typing:stopped", ({ senderId }) => {
      dispatch(setTyping({ userId: senderId, isTyping: false }));
    });

    return () => {
      socket.off("message:received");
      socket.off("typing:started");
      socket.off("typing:stopped");
    };
  }, [socket, activeConversation]);

  const fetchMessages = async () => {
    try {
      const { data } = await messageAPI.getMessages(activeConversation);
      dispatch(
        setMessages({ userId: activeConversation, messages: data.messages }),
      );
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const markAsRead = async () => {
    try {
      await messageAPI.markAsRead(activeConversation);
      dispatch(markMessagesAsRead(activeConversation));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (socket && activeConversation) {
      socket.emit("typing:start", { receiverId: activeConversation });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing:stop", { receiverId: activeConversation });
      }, 1000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await messageAPI.sendMessage({
        receiverId: activeConversation,
        content: messageText,
      });

      dispatch(addMessage(data));
      setMessageText("");

      if (socket) {
        socket.emit("typing:stop", { receiverId: activeConversation });
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  const chatMessages = messages[activeConversation] || [];

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        <button
          onClick={() => dispatch(setActiveConversation(null))}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FaArrowLeft />
        </button>

        <img
          src={otherUser?.profilePicture || "/avatar.png"}
          alt={otherUser?.name}
          className="w-10 h-10 rounded-full object-cover border"
        />

        <div>
          <div className="font-semibold text-gray-900">{otherUser?.name}</div>

          {otherUser?.isOnline ? (
            <div className="text-xs text-green-500">Active now</div>
          ) : (
            <div className="text-xs text-gray-500">
              {otherUser?.lastSeen &&
                `Active ${formatDistanceToNow(new Date(otherUser.lastSeen), {
                  addSuffix: true,
                })}`}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {chatMessages.map((message) => {
              const isSender = message.sender === currentUser._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                      isSender
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none border"
                    }`}
                  >
                    <div className="text-sm break-words">{message.content}</div>
                    <div
                      className={`text-[10px] mt-1 ${
                        isSender ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Typing Indicator */}
        {typingUsers[activeConversation] && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none border shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 p-4 border-t bg-white"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!messageText.trim() || sending}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
};
export default ChatWindow;
