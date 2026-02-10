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
      <div className="chat-container">
        <div className="loading-container">
          <div
            className="spinner"
            style={{ width: "40px", height: "40px" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        {(!isMobileView || !activeConversation) && <ConversationsList />}

        {(!isMobileView || activeConversation) && <ChatWindow />}
      </div>
    </div>
  );
};

export default Chat;
