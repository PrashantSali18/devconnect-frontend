import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { setActiveConversation } from '../../redux/slices/chatSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';

const ConversationsList = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation } = useSelector((state) => state.chat);
  const currentUser = useSelector(selectCurrentUser);

  const getOtherUser = (participants) => {
    return participants.find(p => p._id !== currentUser._id);
  };

  return (
    <div className="conversations-list">
      <div className="conversations-header">
        <h2>Messages</h2>
      </div>

      <div className="conversations-items">
        {conversations.length === 0 ? (
          <div className="empty-state">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation.participants);
            const isActive = activeConversation === otherUser._id;
            const unreadCount = conversation.unreadCount?.[currentUser._id] || 0;

            return (
              <div
                key={conversation._id}
                className={`conversation-item ${isActive ? 'conversation-active' : ''}`}
                onClick={() => dispatch(setActiveConversation(otherUser._id))}
              >
                <div className="conversation-avatar-wrapper">
                  <img
                    src={otherUser.profilePicture}
                    alt={otherUser.name}
                    className="avatar"
                  />
                  {otherUser.isOnline && <div className="online-indicator"></div>}
                </div>

                <div className="conversation-info">
                  <div className="conversation-name">{otherUser.name}</div>
                  <div className="conversation-last-message">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </div>
                </div>

                <div className="conversation-meta">
                  {conversation.lastMessage?.timestamp && (
                    <div className="conversation-time">
                      {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                  {unreadCount > 0 && (
                    <div className="conversation-unread">{unreadCount}</div>
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