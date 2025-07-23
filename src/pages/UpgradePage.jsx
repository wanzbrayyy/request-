
import React, { useEffect } from 'react';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { CheckCircle, Crown } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { stripeConfig, midtransConfig } from '@/config';
    
    const UpgradePage = () => {
      const { t } = useTranslation();
      const { toast } = useToast();
    
      useEffect(() => {
        // Load Stripe.js
        const stripeScript = document.createElement('script');
        stripeScript.src = 'https://js.stripe.com/v3/';
        stripeScript.async = true;
        document.body.appendChild(stripeScript);
    
        // Load Midtrans Snap.js
        const midtransScript = document.createElement('script');
        midtransScript.src = midtransConfig.isProduction 
          ? 'https://app.midtrans.com/snap/snap.js' 
          : 'https://app.sandbox.midtrans.com/snap/snap.js';
        midtransScript.setAttribute('data-client-key', midtransConfig.clientKey);
        midtransScript.async = true;
        document.body.appendChild(midtransScript);
    
        return () => {
          document.body.removeChild(stripeScript);
          document.body.removeChild(midtransScript);
        };
      }, []);
    
      const handleStripeUpgrade = () => {
        if (!stripeConfig.publishableKey || !stripeConfig.priceId || !window.Stripe || stripeConfig.publishableKey.includes('YOUR_STRIPE')) {
          toast({
            variant: "destructive",
            title: "Stripe Not Configured",
            description: "Please provide valid Stripe keys in the config file.",
          });
          return;
        }
    
        const stripe = window.Stripe(stripeConfig.publishableKey);
        stripe.redirectToCheckout({
          lineItems: [{ price: stripeConfig.priceId, quantity: 1 }],
          mode: 'payment',
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/upgrade`,
        }).then(function (result) {
          if (result.error) {
            toast({
              variant: "destructive",
              title: "Payment Error",
              description: result.error.message,
            });
          }
        });
      };
    
      const handleMidtransUpgrade = async () => {
        if (!midtransConfig.clientKey || midtransConfig.clientKey.includes('YOUR_MIDTRANS')) {
            toast({
                variant: "destructive",
                title: "Midtrans Not Configured",
                description: "Please provide a valid Midtrans Client Key.",
            });
            return;
        }

        try {
            // In a real app, you would fetch this from your backend.
            // For this demo, we'll simulate a backend call.
            const snapToken = await new Promise(resolve => setTimeout(() => resolve(`demo_token_${Date.now()}`), 500));

            window.snap.pay(snapToken, {
                onSuccess: function(result){
                    /* You may add your own implementation here */
                    console.log(result);
                    toast({
                        title: "Payment Success",
                        description: "Your premium features are now unlocked!",
                    });
                    // Here you would typically update the user's status in your database
                    // and redirect to a success page.
                    window.location.href = '/payment-success';
                },
                onPending: function(result){
                    /* You may add your own implementation here */
                    console.log(result);
                    toast({
                        title: "Payment Pending",
                        description: "Waiting for your payment.",
                    });
                },
                onError: function(result){
                    /* You may add your own implementation here */
                    console.log(result);
                    toast({
                        variant: "destructive",
                        title: "Payment Error",
                        description: "Something went wrong with the payment.",
                    });
                },
                onClose: function(){
                    /* You may add your own implementation here */
                    toast({
                        title: "Payment Closed",
                        description: "You closed the payment popup.",
                    });
                }
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not initiate Midtrans payment.",
            });
            console.error("Midtrans error:", error);
        }
      };
    
      return (
        <>
          <Helmet>
            <title>{t('upgrade_to_premium')} - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md glassmorphism shadow-lg shadow-primary/20">
              <CardHeader className="text-center">
                <Crown className="mx-auto h-12 w-12 text-yellow-400" />
                <CardTitle className="text-3xl font-bold mt-4">{t('upgrade_to_premium')}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">{t('premium_price')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('premium_feature_1')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('premium_feature_2')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('premium_feature_3')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button onClick={handleStripeUpgrade} size="lg" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-lg">
                  {t('upgrade_now')} (Stripe)
                </Button>
                <Button onClick={handleMidtransUpgrade} size="lg" variant="secondary" className="w-full">
                  {t('upgrade_now')} (Midtrans)
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default UpgradePage;
