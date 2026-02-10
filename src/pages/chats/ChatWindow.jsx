import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { messageAPI } from '../../utils/api.js';
import { setMessages, addMessage, setActiveConversation, markMessagesAsRead, setTyping } from '../../redux/slices/chatSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import useSocket from '../../hooks/useScoket.js';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { activeConversation, messages, conversations, typingUsers } = useSelector((state) => state.chat);
  const currentUser = useSelector(selectCurrentUser);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = conversations
    .flatMap(c => c.participants)
    .find(p => p._id === activeConversation);

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

    socket.on('message:received', (message) => {
      if (message.sender === activeConversation || message.receiver === activeConversation) {
        dispatch(addMessage(message));
        if (message.sender === activeConversation) {
          markAsRead();
        }
      }
    });

    socket.on('typing:started', ({ senderId }) => {
      if (senderId === activeConversation) {
        dispatch(setTyping({ userId: senderId, isTyping: true }));
      }
    });

    socket.on('typing:stopped', ({ senderId }) => {
      dispatch(setTyping({ userId: senderId, isTyping: false }));
    });

    return () => {
      socket.off('message:received');
      socket.off('typing:started');
      socket.off('typing:stopped');
    };
  }, [socket, activeConversation]);

  const fetchMessages = async () => {
    try {
      const { data } = await messageAPI.getMessages(activeConversation);
      dispatch(setMessages({ userId: activeConversation, messages: data.messages }));
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const markAsRead = async () => {
    try {
      await messageAPI.markAsRead(activeConversation);
      dispatch(markMessagesAsRead(activeConversation));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (socket && activeConversation) {
      socket.emit('typing:start', { receiverId: activeConversation });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { receiverId: activeConversation });
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
      setMessageText('');

      if (socket) {
        socket.emit('typing:stop', { receiverId: activeConversation });
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!activeConversation) {
    return (
      <div className="chat-window-empty">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  const chatMessages = messages[activeConversation] || [];

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <button
          className="chat-back-btn"
          onClick={() => dispatch(setActiveConversation(null))}
        >
          <FaArrowLeft />
        </button>
        <img
          src={otherUser?.profilePicture}
          alt={otherUser?.name}
          className="avatar avatar-sm"
        />
        <div className="chat-header-info">
          <div className="chat-header-name">{otherUser?.name}</div>
          {otherUser?.isOnline ? (
            <div className="chat-header-status online">Active now</div>
          ) : (
            <div className="chat-header-status">
              {otherUser?.lastSeen && `Active ${formatDistanceToNow(new Date(otherUser.lastSeen), { addSuffix: true })}`}
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {chatMessages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => {
              const isSender = message.sender === currentUser._id;
              return (
                <div
                  key={message._id}
                  className={`message ${isSender ? 'message-sent' : 'message-received'}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {typingUsers[activeConversation] && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="input"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!messageText.trim() || sending}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;