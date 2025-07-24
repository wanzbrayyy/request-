import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { useToast } from '@/components/ui/use-toast';
    import { Paperclip, Link as LinkIcon, Send, UserX, Home } from 'lucide-react';
    import { sendLocalNotification } from '@/utils/notifications';
import Swal from 'sweetalert2';
    
    const RequestPage = () => {
      const { username } = useParams();
      const { t } = useTranslation();
      const { toast } = useToast();
      const [user, setUser] = useState(null);
      const [message, setMessage] = useState('');
      const [link, setLink] = useState('');
      const [image, setImage] = useState(null);
      const [imagePreview, setImagePreview] = useState('');
      const [isLoading, setIsLoading] = useState(true);
      const [isSending, setIsSending] = useState(false);
    
      useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        setUser(foundUser);
        setIsLoading(false);
      }, [username]);
    
      const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
          toast({ title: "Image selected. Ready for upload!" });
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
          toast({ variant: 'destructive', title: "Message cannot be empty." });
          return;
        }

        const now = new Date().getTime();
        const requestHistory = JSON.parse(localStorage.getItem('requestHistory') || '{}');
        const userRequestHistory = requestHistory[user.username] || [];

        const recentRequests = userRequestHistory.filter(timestamp => now - timestamp < 3600000); // 1 hour

        if (recentRequests.length >= 20) {
            toast({
                variant: "destructive",
                title: "Rate Limit Exceeded",
                description: "You have sent too many messages. Please try again later.",
            });
            return;
        }

        let hitInfo = {
            ip: 'N/A',
            country: 'N/A',
            city: 'N/A',
            region: 'N/A',
            org: 'N/A',
            device: navigator.userAgent,
        };

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            hitInfo = {
                ...hitInfo,
                ip: data.ip,
                country: data.country_name,
                city: data.city,
                region: data.region,
                org: data.org,
            };
        } catch (error) {
            console.error("Error fetching IP info:", error);
        }
    
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const newMessage = {
          id: Date.now(),
          recipient: user.username,
          text: message,
          link: link,
          image: imagePreview,
          timestamp: new Date().toISOString(),
          senderUsername: `Anonymous-${Date.now()}`,
          senderProfilePicture: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Date.now()}`,
          hitInfo: hitInfo
        };
    
        allMessages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(allMessages));

        recentRequests.push(now);
        requestHistory[user.username] = recentRequests;
        localStorage.setItem('requestHistory', JSON.stringify(requestHistory));
    
        sendLocalNotification(`New message for @${user.username}`, message.substring(0, 50) + '...');
    
        Swal.fire({
          title: 'Pesan berhasil terkirim!',
          text: 'Pesan Anda telah berhasil dikirim ke ' + user.username,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setMessage('');
        setLink('');
        setImage(null);
        setImagePreview('');
        setIsSending(true);
        setTimeout(() => setIsSending(false), 5000);
      };
    
      if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      }
    
      if (!user) {
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md text-center glassmorphism">
              <CardHeader>
                <div className="mx-auto bg-destructive/20 p-3 rounded-full w-fit">
                  <UserX className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl mt-4">User Not Found</CardTitle>
                <CardDescription>The user profile you are looking for does not exist.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Please check the username and try again.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      }
    
      return (
        <>
          <Helmet>
            <title>{t('send_a_message')} {user.username} - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-lg glassmorphism">
              <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl break-words">{user.requestTitle}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                  <textarea
                    id="message"
                    placeholder={t('message_placeholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="link"><LinkIcon className="inline-block mr-2 h-4 w-4" />{t('view_link')} (Optional)</Label>
                    <Input id="link" type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image-upload"><Paperclip className="inline-block mr-2 h-4 w-4" />{t('upload_image')} (Optional)</Label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="rounded-md max-h-40 mx-auto" />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSending}>
                    {isSending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Send className="mr-2 h-4 w-4" /> {t('send')}</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default RequestPage;