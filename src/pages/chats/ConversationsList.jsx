import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { setActiveConversation } from "../../redux/slices/chatSlice";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const ConversationsList = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat,
  );
  const currentUser = useSelector(selectCurrentUser);

  const getOtherUser = (participants) => {
    return participants.find((p) => p._id !== currentUser._id);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation.participants);
            const isActive = activeConversation === otherUser._id;
            const unreadCount =
              conversation.unreadCount?.[currentUser._id] || 0;

            return (
              <div
                key={conversation._id}
                onClick={() => dispatch(setActiveConversation(otherUser._id))}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-indigo-50 border-l-4 border-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={otherUser.profilePicture}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {otherUser.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage?.content || "No messages yet"}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1 ml-2">
                  {conversation.lastMessage?.timestamp && (
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(
                        new Date(conversation.lastMessage.timestamp),
                        { addSuffix: true },
                      )}
                    </div>
                  )}
                  {unreadCount > 0 && (
                    <div className="min-w-[20px] h-5 px-2 bg-indigo-600 text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
