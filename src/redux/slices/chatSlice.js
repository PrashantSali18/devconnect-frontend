import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  unreadCount: 0,
  loading: false,
  error: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
    },
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.messages[userId] = messages;
      state.loading = false;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const otherUserId = message.sender === state.activeConversation 
        ? message.receiver 
        : message.sender;
      
      if (!state.messages[otherUserId]) {
        state.messages[otherUserId] = [];
      }
      state.messages[otherUserId].push(message);
      
      // Update conversation
      const convIndex = state.conversations.findIndex(
        c => c.participants.some(p => p._id === otherUserId)
      );
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = {
          content: message.content,
          sender: message.sender,
          timestamp: message.createdAt,
        };
        // Move to top
        const conv = state.conversations.splice(convIndex, 1)[0];
        state.conversations.unshift(conv);
      }
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },
    markMessagesAsRead: (state, action) => {
      const userId = action.payload;
      if (state.messages[userId]) {
        state.messages[userId] = state.messages[userId].map(msg => ({
          ...msg,
          isRead: true,
        }));
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setConversations,
  setMessages,
  addMessage,
  setActiveConversation,
  setTyping,
  markMessagesAsRead,
  setUnreadCount,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;