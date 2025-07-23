import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { requestNotificationPermission } from '@/utils/notifications';
    
    const LoginPage = () => {
      const { login, currentUser } = useAuth();
      const navigate = useNavigate();
      const { t } = useTranslation();
      const { toast } = useToast();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
    
      useEffect(() => {
        if (currentUser) {
          navigate('/dashboard');
        }
      }, [currentUser, navigate]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        // Simulate network delay
        setTimeout(() => {
          const user = login(username, password);
          if (user) {
            toast({ title: t('login_success') });
            requestNotificationPermission();
            navigate('/dashboard');
          } else {
            setError(t('invalid_credentials'));
            toast({ variant: 'destructive', title: t('invalid_credentials') });
          }
          setIsLoading(false);
        }, 1000);
      };
    
      return (
        <>
          <Helmet>
            <title>{t('login')} - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-sm glassmorphism">
              <CardHeader>
                <CardTitle className="text-2xl">{t('login')}</CardTitle>
                <CardDescription>{t('already_have_account')}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('loading') : t('login')}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {t('dont_have_account')}{' '}
                    <Link to="/register" className="underline text-primary">
                      {t('register')}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default LoginPage;