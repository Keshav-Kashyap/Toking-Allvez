import React, { useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

const ChatModal = ({
    showModal,
    onClose,
    messages,
    message,
    setMessage,
    onSendMessage,
    username
}) => {
    const chatDisplayRef = useRef(null);

    const scrollToBottom = () => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(scrollToBottom, 100);
        }
    }, [messages]);

    useEffect(() => {
        if (showModal) {
            setTimeout(scrollToBottom, 200);
        }
    }, [showModal]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage();
            setTimeout(scrollToBottom, 100);
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Meeting Chat</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Messages Display */}
            <div
                ref={chatDisplayRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
                style={{ scrollbarWidth: 'thin' }}
            >
                {messages.length > 0 ? messages.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${item.sender === username ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${item.sender === username
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {item.sender !== username && (
                                <div className="text-xs font-medium text-gray-600 mb-1">
                                    {item.sender}
                                </div>
                            )}
                            <div className="text-sm leading-relaxed">{item.data}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-1">
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
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs">Start the conversation!</p>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="1"
                            style={{ minHeight: '36px', maxHeight: '100px' }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;