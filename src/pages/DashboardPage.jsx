
import React, { useState, useEffect, useRef } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import html2canvas from 'html2canvas';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Download, Link as LinkIcon, Eye, ShieldAlert } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
import InstallAppAlert from '@/components/InstallAppAlert';
    
    const getOs = (userAgent) => {
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        if (/Win/.test(userAgent)) {
            return "Windows";
        }
        if (/Mac/.test(userAgent)) {
            return "MacOS";
        }
        if (/Linux/.test(userAgent)) {
            return "Linux";
        }
        return "Unknown";
    };

    const DashboardPage = () => {
      const { currentUser, updateUser } = useAuth();
      const { t } = useTranslation();
      const { toast } = useToast();
      const [messages, setMessages] = useState([]);
      const [selectedMessage, setSelectedMessage] = useState(null);
      const [showInstallAlert, setShowInstallAlert] = useState(false);
      const [deferredPrompt, setDeferredPrompt] = useState(null);
      const messageCardRef = useRef(null);

      useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          setDeferredPrompt(e);
          setShowInstallAlert(true);
        });

        window.addEventListener('appinstalled', () => {
          localStorage.setItem('appInstalled', 'true');
          setShowInstallAlert(false);
        });

        const appInstalled = localStorage.getItem('appInstalled');
        if (appInstalled) {
          setShowInstallAlert(false);
        }
      }, []);

      const handleInstall = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            const newHitCount = (currentUser.hitCount || 0) + 20;
            updateUser({ hitCount: newHitCount });
            toast({
              title: "Thank you for installing!",
              description: "20 hits have been added to your account.",
            });
          }
          setDeferredPrompt(null);
        }
      };
    
      useEffect(() => {
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const userMessages = allMessages.filter(msg => msg.recipient === currentUser.username && msg.type === 'request');
        setMessages(userMessages.reverse());
      }, [currentUser.username]);
    
      const handleHitInfo = (message) => {
        if (currentUser.plan === 'premium') {
          setSelectedMessage(message);
        } else {
          if (currentUser.hitCount < 10) {
            const newHitCount = (currentUser.hitCount || 0) + 1;
            updateUser({ hitCount: newHitCount });
            setSelectedMessage(message);
            toast({
              title: t('hit_info'),
              description: t('hit_message', { count: 10 - newHitCount }),
            });
          } else {
            toast({
              variant: "destructive",
              title: t('hit_limit_reached'),
              description: t('upgrade_to_premium'),
            });
          }
        }
      };
    
      const handleDownloadImage = () => {
        if (!messageCardRef.current) return;
    
        html2canvas(messageCardRef.current, {
            backgroundColor: '#111827',
            useCORS: true,
            scale: 2,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `wanz-req-message-${selectedMessage.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: "Image download started." });
        });
      };
    
      return (
        <>
          <Helmet>
            <title>{t('dashboard')} - {t('wanz_req')}</title>
            <meta name="description" content="View your anonymous messages." />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {showInstallAlert && <InstallAppAlert onInstall={handleInstall} />}
            <h1 className="text-3xl font-bold tracking-tight">{t('inbox')}</h1>
            {messages.length === 0 ? (
              <Card className="text-center py-12 glassmorphism">
                <CardContent>
                  <p className="text-muted-foreground">{t('no_messages')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg) => (
                  <motion.div key={msg.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                    <Card className="overflow-hidden cursor-pointer h-full flex flex-col glassmorphism" onClick={() => setSelectedMessage(msg)}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                          <AvatarImage src={msg.senderProfilePicture} alt={msg.senderUsername} />
                          <AvatarFallback>{msg.senderUsername.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{t('from_anon')}</CardTitle>
                          <CardDescription>{new Date(msg.timestamp).toLocaleString()}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="truncate">{msg.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
    
          {selectedMessage && (
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
              <DialogContent className="max-w-md w-full glassmorphism">
                <div ref={messageCardRef} className="p-6 bg-gray-900 rounded-t-lg">
                    <DialogHeader>
                      <DialogTitle>{t('from_anon')}</DialogTitle>
                      <DialogDescription>{new Date(selectedMessage.timestamp).toLocaleString()}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <p className="text-lg whitespace-pre-wrap text-white">{selectedMessage.text}</p>
                      {selectedMessage.image && (
                        <div className="space-y-2">
                          <img  class="rounded-lg max-h-60 w-full object-cover" alt="Received image preview" src={selectedMessage.image} />
                        </div>
                      )}
                    </div>
                </div>
                <div className="p-6 bg-background rounded-b-lg space-y-4">
                  {selectedMessage.link && (
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <span className="truncate">{selectedMessage.link}</span>
                        <a href={selectedMessage.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon"><LinkIcon className="h-4 w-4" /></Button>
                        </a>
                      </div>
                    </div>
                  )}
                  <Button onClick={() => handleHitInfo(selectedMessage)} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                    <Eye className="mr-2 h-4 w-4" /> {t('hit_info')}
                  </Button>
                  {(currentUser.plan === 'premium' || (currentUser.hitCount > 0 && currentUser.hitCount <= 10)) && (
                    <Card className="bg-secondary/50">
                      <CardHeader>
                        <CardTitle className="text-base">{t('sender_info')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentUser.plan === 'premium' || (currentUser.hitCount > 0 && currentUser.hitCount <= 10) ? (
                          <ul className="space-y-2 text-sm">
                            <li><strong>Alamat Terdeteksi:</strong> {selectedMessage.hitInfo.address || 'N/A'}</li>
                            <li><strong>IP Lokasi:</strong> {selectedMessage.hitInfo.ip}</li>
                            <li><strong>Koordinat:</strong> {`${selectedMessage.hitInfo.latitude}, ${selectedMessage.hitInfo.longitude}`}</li>
                            <li><strong>Negara:</strong> {selectedMessage.hitInfo.country}</li>
                            <li><strong>Perangkat:</strong> {getOs(selectedMessage.hitInfo.device)}</li>
                            <li><strong>ISP:</strong> {selectedMessage.hitInfo.org}</li>
                          </ul>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <ShieldAlert className="mx-auto h-8 w-8 mb-2" />
                            <p>{t('upgrade_to_premium')}</p>
                          </div>
                        )}
                        {selectedMessage.hitInfo.latitude && selectedMessage.hitInfo.longitude && (
                            <div className="mt-4">
                                <iframe
                                    width="100%"
                                    height="200"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedMessage.hitInfo.longitude-0.01},${selectedMessage.hitInfo.latitude-0.01},${selectedMessage.hitInfo.longitude+0.01},${selectedMessage.hitInfo.latitude+0.01}&layer=mapnik&marker=${selectedMessage.hitInfo.latitude},${selectedMessage.hitInfo.longitude}`}
                                    style={{ border: '1px solid black', borderRadius: '8px' }}
                                ></iframe>
                            </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                   <Button onClick={handleDownloadImage} size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> {t('download_image')}
                    </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      );
    };
    
    export default DashboardPage;
