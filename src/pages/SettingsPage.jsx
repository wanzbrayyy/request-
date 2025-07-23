
    import React, { useState } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { useToast } from '@/components/ui/use-toast';
    import { Copy, Crown } from 'lucide-react';
    
    const SettingsPage = () => {
      const { currentUser, updateUser } = useAuth();
      const { t } = useTranslation();
      const { toast } = useToast();
    
      const [requestTitle, setRequestTitle] = useState(currentUser.requestTitle);
      const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture);
      const [imageFile, setImageFile] = useState(null);
    
      const handlePictureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setImageFile(file);
          setProfilePicture(URL.createObjectURL(file));
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        updateUser({
          requestTitle,
          profilePicture,
        });
        toast({ title: t('settings_saved') });
      };
    
      const copyToClipboard = () => {
        const link = `${window.location.origin}/${currentUser.username}`;
        navigator.clipboard.writeText(link);
        toast({ title: t('link_copied') });
      };
    
      return (
        <>
          <Helmet>
            <title>{t('settings')} - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-2xl">{t('settings')}</CardTitle>
                <CardDescription>Manage your account and profile settings.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>{t('your_profile_link')}</Label>
                    <div className="flex items-center gap-2">
                      <Input type="text" readOnly value={`${window.location.origin}/${currentUser.username}`} className="w-auto" />
                      <Button type="button" size="icon" variant="ghost" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="requestTitle">{t('request_title')}</Label>
                    <Input id="requestTitle" value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} />
                  </div>
    
                  <div className="space-y-2">
                    <Label>{t('profile_picture')}</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profilePicture} alt={currentUser.username} />
                        <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Input id="picture" type="file" accept="image/*" onChange={handlePictureChange} />
                    </div>
                  </div>
    
                  <div className="space-y-2">
                    <Label>Account Plan</Label>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${currentUser.plan === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-secondary'}`}>
                      {currentUser.plan === 'premium' ? <Crown className="h-5 w-5 text-yellow-400" /> : <span className="font-bold">🆓</span>}
                      <span className="font-semibold capitalize">{t(`${currentUser.plan}_plan`)}</span>
                    </div>
                  </div>
    
                </CardContent>
                <CardFooter>
                  <Button type="submit">{t('save_settings')}</Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default SettingsPage;
  