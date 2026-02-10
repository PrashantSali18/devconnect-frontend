import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConversationsList from "./ConversationsList.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { messageAPI } from "../../utils/api.js";
import { setConversations, setLoading } from "../../redux/slices/chatSlice.js";

const Chat = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation, loading } = useSelector(
    (state) => state.chat,
  );
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchConversations();

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchConversations = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await messageAPI.getConversations();
      dispatch(setConversations(data));
    } catch (error) {
      toast.error("Failed to load conversations");
    }
  };

  if (loading && conversations.length === 0) {
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);
}

return (
  <div className="min-h-screen bg-gray-50 pt-16">
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-4rem)] bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Conversations List */}
      {(!isMobileView || !activeConversation) && (
        <div className="w-full md:w-80 border-r border-gray-200">
          <ConversationsList />
        </div>
      )}

      {/* Chat Window */}
      {(!isMobileView || activeConversation) && (
        <div className="flex-1">
          <ChatWindow />
        </div>
      )}
    </div>
  </div>
);
};

export default Chat;
