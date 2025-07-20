import React, { useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import styles from "../../styles/videoComponent.module.css";

const ChatModal = ({
    showModal,
    onClose,
    messages,
    message,
    setMessage,
    onSendMessage,
    username
}) => {
    // Chat container के लिए ref
    const chatDisplayRef = useRef(null);

    // Auto scroll function
    const scrollToBottom = () => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    };

    // Messages change होने पर auto scroll
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Modal open होने पर भी scroll करें
    useEffect(() => {
        if (showModal) {
            setTimeout(scrollToBottom, 100); // Small delay for rendering
        }
    }, [showModal]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && message.trim()) {
            onSendMessage();
        }
    };

    const handleSendMessage = () => {
        onSendMessage();
        // Message send करने के बाद तुरंत scroll करें
        setTimeout(scrollToBottom, 50);
    };

    if (!showModal) return null;

    return (
        <div className={styles.chatModal}>
            <div className={styles.chatRoom}>
                <div className={styles.chatHeader}>
                    <h3>Meeting Chat</h3>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        className={styles.closeChat}
                    >
                        ×
                    </IconButton>
                </div>

                {/* Ref add किया गया है और scroll behavior */}
                <div
                    className={styles.chattingDisplay}
                    ref={chatDisplayRef}
                    style={{
                        overflowY: 'auto',
                        scrollBehavior: 'smooth' // Smooth scrolling
                    }}
                >
                    {messages.length > 0 ? messages.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.messageItem} ${item.sender === username ? styles.ownMessage : styles.otherMessage
                                }`}
                        >
                            <div className={styles.messageSender}>{item.sender}</div>
                            <div className={styles.messageContent}>{item.data}</div>
                            <div className={styles.messageTime}>
                                {item.timestamp?.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) || new Date().toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className={styles.noMessages}>
                            <p>No messages yet</p>
                            <p>Start the conversation!</p>
                        </div>
                    )}
                </div>

                <div className={styles.chattingArea}>
                    <TextField
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        onKeyPress={handleKeyPress}
                    />
                    <IconButton
                        onClick={handleSendMessage} // Updated handler
                        color="primary"
                        className={styles.sendButton}
                        disabled={!message.trim()}
                    >
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;