
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMessages, markMessageAsRead, getFile } from '@/utils/storage';

const InboxPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (user) {
      const userMessages = getMessages(user.username);
      setMessages(userMessages);
    }
  }, [user]);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageAsRead(message.id);
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      ));
    }
  };

  const downloadImage = (message) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Message content
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Wanz Req Message', canvas.width / 2, 60);
    
    ctx.font = '18px Arial';
    ctx.fillText(`From: ${message.senderName || 'Anonymous'}`, canvas.width / 2, 120);
    
    // Message text
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    const words = message.content.split(' ');
    let line = '';
    let y = 180;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > canvas.width - 100 && n > 0) {
        ctx.fillText(line, 50, y);
        line = words[n] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 50, y);
    
    // Download
    const link = document.createElement('a');
    link.download = `wanzreq_message_${message.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>{t('inbox')} - Wanz Req</title>
        <meta name="description" content="View and manage your anonymous messages in your inbox." />
      </Helmet>

      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <i className="fas fa-inbox mr-3 text-purple-400"></i>
              {t('inbox')}
            </h1>
            <p className="text-gray-300">
              {messages.length} messages • {messages.filter(msg => !msg.read).length} unread
            </p>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card 
                          className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                            message.read 
                              ? 'bg-gray-900/30 border-gray-600' 
                              : 'bg-purple-900/30 border-purple-500/50'
                          } backdrop-blur-xl`}
                          onClick={() => handleMessageClick(message)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={message.senderAvatar} />
                                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    {message.senderName ? message.senderName[0].toUpperCase() : 'A'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-white text-lg">
                                    {message.senderName || t('anonymous')}
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {new Date(message.timestamp).toLocaleString()}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!message.read && (
                                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                )}
                                {message.attachments && message.attachments.length > 0 && (
                                  <i className="fas fa-paperclip text-purple-400"></i>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 line-clamp-2">
                              {message.content}
                            </p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      
                      <DialogContent className="sm:max-w-2xl bg-gray-900/95 backdrop-blur-xl border-purple-500/20">
                        <DialogHeader>
                          <DialogTitle className="text-white flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                                {message.senderName ? message.senderName[0].toUpperCase() : 'A'}
                              </AvatarFallback>
                            </Avatar>
                            {message.senderName || t('anonymous')}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-white whitespace-pre-wrap">{message.content}</p>
                          </div>
                          
                          {message.link && (
                            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/20">
                              <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-link text-blue-400"></i>
                                <span className="text-blue-400 font-medium">Attached Link</span>
                              </div>
                              <a 
                                href={message.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-200 break-all"
                              >
                                {message.link}
                              </a>
                            </div>
                          )}
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="space-y-2">
                              {message.attachments.map((attachmentId) => {
                                const file = getFile(attachmentId);
                                if (!file) return null;
                                
                                return (
                                  <div key={attachmentId} className="bg-gray-800/50 p-4 rounded-lg">
                                    {file.type.startsWith('image/') ? (
                                      <img 
                                        src={file.data} 
                                        alt={file.name}
                                        className="max-w-full h-auto rounded-lg"
                                      />
                                    ) : (
                                      <div className="flex items-center space-x-3">
                                        <i className="fas fa-file text-gray-400 text-2xl"></i>
                                        <div>
                                          <p className="text-white font-medium">{file.name}</p>
                                          <p className="text-gray-400 text-sm">
                                            {(file.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div className="text-gray-400 text-sm">
                              <i className="fas fa-clock mr-2"></i>
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                            <Button
                              onClick={() => downloadImage(message)}
                              variant="outline"
                              size="sm"
                              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                            >
                              <i className="fas fa-download mr-2"></i>
                              Download Image
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center py-16"
                >
                  <Card className="bg-gray-900/30 backdrop-blur-xl border-gray-600">
                    <CardContent className="py-16">
                      <i className="fas fa-inbox text-gray-500 text-6xl mb-6"></i>
                      <h3 className="text-2xl font-bold text-white mb-2">No Messages Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Share your link to start receiving anonymous messages!
                      </p>
                      <Button 
                        onClick={() => {
                          const link = `${window.location.origin}/${user.username}`;
                          navigator.clipboard.writeText(link);
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <i className="fas fa-copy mr-2"></i>
                        Copy Your Link
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default InboxPage;
