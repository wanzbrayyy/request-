import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import AnimatedEmojiMessage from '@/components/AnimatedEmojiMessage';

const ChatPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { chatUsername } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };


  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = allUsers.find(u => u.username === chatUsername);
    setOtherUser(foundUser);

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const chatMessages = allMessages.filter(
      msg =>
        (msg.senderUsername === currentUser.username && msg.recipient === chatUsername) ||
        (msg.senderUsername === chatUsername && msg.recipient === currentUser.username)
    );
    setMessages(chatMessages);
  }, [chatUsername, currentUser.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      type: 'dm',
      recipient: chatUsername,
      text: newMessage,
      timestamp: new Date().toISOString(),
      senderUsername: currentUser.username,
      senderProfilePicture: currentUser.profilePicture,
    };

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(messageData);
    localStorage.setItem('messages', JSON.stringify(allMessages));
    setMessages([...messages, messageData]);
    setNewMessage('');
  };

  if (!otherUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Chat with {otherUser.username} - {t('wanz_req')}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-[calc(100vh-80px)] glassmorphism m-4 rounded-lg"
      >
        <CardHeader className="flex flex-row items-center gap-3 border-b">
          <Button asChild variant="ghost" size="icon">
            <Link to="/dm">
              <ArrowLeft />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={otherUser.profilePicture} />
            <AvatarFallback>{otherUser.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle>{otherUser.username}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.senderUsername === currentUser.username ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.senderUsername === currentUser.username ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <AnimatedEmojiMessage text={msg.text} />
              </div>
              <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          {showEmojiPicker && (
            <div className="absolute bottom-20">
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          )}
          <div className="relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('type_a_message')}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Smile className="h-5 w-5" />
            </Button>
            <Button onClick={handleSendMessage} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatPage;
