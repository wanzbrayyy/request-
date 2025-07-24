import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DmPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setAllUsers(users.filter(u => u.username !== currentUser.username));

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    const groupedMessages = allMessages.reduce((acc, msg) => {
      const otherUser = msg.recipient === currentUser.username ? msg.senderUsername : msg.recipient;
      if (!acc[otherUser]) {
        acc[otherUser] = {
            user: otherUser,
            profilePicture: msg.senderUsername.startsWith('Anonymous') ? msg.senderProfilePicture : users.find(u => u.username === otherUser)?.profilePicture,
            messages: []
        };
      }
      acc[otherUser].messages.push(msg);
      return acc;
    }, {});

    const convos = Object.values(groupedMessages).map(convo => ({
      ...convo,
      lastMessage: convo.messages[convo.messages.length - 1],
    }));

    setConversations(convos);
  }, [currentUser.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSelectConversation = (user) => {
    const existingConversation = conversations.find(c => c.user === user.username);
    if (existingConversation) {
        setSelectedConversation(existingConversation);
    } else {
        setSelectedConversation({
            user: user.username,
            profilePicture: user.profilePicture,
            messages: [],
        });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      recipient: selectedConversation.user,
      text: message,
      timestamp: new Date().toISOString(),
      senderUsername: currentUser.username,
      senderProfilePicture: currentUser.profilePicture,
    };
    
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    if (conversations.find(c => c.user === selectedConversation.user)) {
        const updatedConversations = conversations.map(c => {
            if (c.user === selectedConversation.user) {
                return { ...c, messages: [...c.messages, newMessage], lastMessage: newMessage };
            }
            return c;
        });
        setConversations(updatedConversations);
    } else {
        const newConversation = {
            user: selectedConversation.user,
            profilePicture: selectedConversation.profilePicture,
            messages: [newMessage],
            lastMessage: newMessage,
        };
        setConversations([...conversations, newConversation]);
    }

    setSelectedConversation(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    setMessage('');
  };

  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Card className="w-1/3 glassmorphism m-4 flex flex-col">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a user..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Chats</h2>
            {conversations.map(convo => (
              <div key={convo.user} onClick={() => setSelectedConversation(convo)} className={`p-2 hover:bg-muted rounded-lg cursor-pointer flex items-center gap-3 ${selectedConversation?.user === convo.user ? 'bg-muted' : ''}`}>
                <Avatar>
                  <AvatarImage src={convo.profilePicture} />
                  <AvatarFallback>{convo.user.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold">{convo.user.startsWith('Anonymous') ? 'Anonymous' : convo.user}</p>
                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
                </div>
              </div>
            ))}
             <h2 className="text-lg font-semibold my-2">All Users</h2>
            {filteredUsers.map(user => (
              <div key={user.id} onClick={() => handleSelectConversation(user)} className="p-2 hover:bg-muted rounded-lg cursor-pointer flex items-center gap-3">
                 <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-bold">{user.username}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-2/3 glassmorphism m-4 flex flex-col">
            {selectedConversation ? (
                <>
                <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar>
                        <AvatarImage src={selectedConversation.profilePicture} />
                        <AvatarFallback>{selectedConversation.user.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{selectedConversation.user.startsWith('Anonymous') ? 'Anonymous' : selectedConversation.user}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.senderUsername === currentUser.username ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.senderUsername === currentUser.username ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p>{msg.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t">
                    <div className="relative">
                    <Input value={message} onChange={e => setMessage(e.target.value)} placeholder={t('type_a_message')} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <Button onClick={handleSendMessage} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold">Select a conversation</h2>
                    <p className="text-muted-foreground">Start chatting with someone from the list.</p>
                </div>
            )}
        </Card>
      </motion.div>
    </>
  );
};

export default DmPage;
