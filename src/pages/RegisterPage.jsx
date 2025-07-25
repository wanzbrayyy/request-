
    import React, { useState } from 'react';
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
    
    const RegisterPage = () => {
      const { register } = useAuth();
      const navigate = useNavigate();
      const { t } = useTranslation();
      const { toast } = useToast();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
          const res = await register(username, password);
          if (res && res.message === 'User created successfully') {
            toast({ title: t('register_success') });
            navigate('/login');
          } else {
            setError(t('user_exists'));
            toast({ variant: 'destructive', title: t('user_exists') });
          }
        } catch (err) {
          setError(t('register_failed'));
          toast({ variant: 'destructive', title: t('register_failed') });
        }
      };
    
      return (
        <>
          <Helmet>
            <title>{t('register')} - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-sm glassmorphism">
              <CardHeader>
                <CardTitle className="text-2xl">{t('register')}</CardTitle>
                <CardDescription>{t('dont_have_account')}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full">{t('register')}</Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {t('already_have_account')}{' '}
                    <Link to="/login" className="underline text-primary">
                      {t('login')}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default RegisterPage;
  