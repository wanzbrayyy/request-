import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DmPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simulate fetching conversations
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    const groupedMessages = allMessages.reduce((acc, msg) => {
      const otherUser = msg.recipient === currentUser.username ? msg.senderUsername : msg.recipient;
      if (!acc[otherUser]) {
        acc[otherUser] = [];
      }
      acc[otherUser].push(msg);
      return acc;
    }, {});

    const convos = Object.keys(groupedMessages).map(user => ({
      user,
      messages: groupedMessages[user],
      lastMessage: groupedMessages[user][groupedMessages[user].length - 1],
    }));

    setConversations(convos);
  }, [currentUser.username]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      recipient: selectedConversation.user,
      text: message,
      timestamp: new Date().toISOString(),
      senderUsername: currentUser.username,
    };
    
    // Simulate sending message
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    // Update UI
    const updatedConversations = conversations.map(c => {
        if (c.user === selectedConversation.user) {
            return { ...c, messages: [...c.messages, newMessage], lastMessage: newMessage };
        }
        return c;
    });
    setConversations(updatedConversations);
    setSelectedConversation(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setMessage('');
  };

  return (
    <>
      <Helmet>
        <title>{t('direct_messages')} - {t('wanz_req')}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-[calc(100vh-80px)]"
      >
        <Card className="w-1/3 glassmorphism m-4">
          <CardHeader>
            <CardTitle>{t('conversations')}</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.map(convo => (
              <div key={convo.user} onClick={() => setSelectedConversation(convo)} className="p-2 hover:bg-muted rounded-lg cursor-pointer">
                <p className="font-bold">{convo.user}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-2/3 glassmorphism m-4 flex flex-col">
          <CardHeader>
            <CardTitle>{selectedConversation ? selectedConversation.user : t('select_a_conversation')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {selectedConversation?.messages.map(msg => (
              <div key={msg.id} className={`flex items-start gap-4 my-4 ${msg.senderUsername === currentUser.username ? 'justify-end' : ''}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </CardContent>
          {selectedConversation && (
            <div className="p-4 border-t">
              <div className="relative">
                <Input value={message} onChange={e => setMessage(e.target.value)} placeholder={t('type_a_message')} />
                <Button onClick={handleSendMessage} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default DmPage;
