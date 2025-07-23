import React from 'react';
    import { Link } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { CheckCircle, Eye, Infinity as Infinite } from 'lucide-react';
    
    const HomePage = () => {
      const { t } = useTranslation();
    
      const featureVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.2,
            duration: 0.5,
          },
        }),
      };
    
      const features = [
        { icon: Eye, title: t('hit_info'), description: t('premium_feature_2') },
        { icon: Infinite, title: t('premium_feature_1'), description: t('premium_price') },
        { icon: CheckCircle, title: t('premium_plan'), description: t('premium_feature_3') },
      ];
    
      return (
        <>
          <Helmet>
            <title>{t('wanz_req')} - {t('tagline')}</title>
            <meta name="description" content={t('meta_description_home')} />
          </Helmet>
          <div className="flex flex-col items-center justify-center text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                {t('wanz_req')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tagline')}
              </p>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-transform">
                <Link to="/register">{t('get_started')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/learn-more">{t('learn_more')}</Link>
              </Button>
            </motion.div>
    
            <div className="w-full max-w-5xl mx-auto pt-12">
              <h2 className="text-3xl font-bold text-center mb-8">{t('upgrade_to_premium')}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={featureVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center glassmorphism">
                      <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    };
    
    export default HomePage;