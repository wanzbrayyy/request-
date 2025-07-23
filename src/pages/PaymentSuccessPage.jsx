
    import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { PartyPopper } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    
    const PaymentSuccessPage = () => {
      const { updateUser } = useAuth();
      const { t } = useTranslation();
      const navigate = useNavigate();
      const { toast } = useToast();
    
      useEffect(() => {
        updateUser({ plan: 'premium' });
        toast({
          title: "Upgrade Successful!",
          description: "Welcome to Premium! 👑",
        });
      }, [updateUser, toast]);
    
      return (
        <>
          <Helmet>
            <title>Payment Successful - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md text-center glassmorphism">
              <CardHeader>
                <PartyPopper className="mx-auto h-16 w-16 text-primary" />
                <CardTitle className="text-3xl font-bold mt-4">Upgrade Successful!</CardTitle>
                <CardDescription className="text-muted-foreground">
                  You are now a Premium member. Enjoy your new features!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default PaymentSuccessPage;
  