import React from 'react';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { UserCheck as UserSecret, MapPin, Smartphone, ShieldCheck, BellRing, Languages } from 'lucide-react';
    
    const LearnMorePage = () => {
      const { t } = useTranslation();
    
      const features = [
        {
          icon: UserSecret,
          title: t('learn_more_feature_1_title'),
          description: t('learn_more_feature_1_desc'),
        },
        {
          icon: MapPin,
          title: t('learn_more_feature_2_title'),
          description: t('learn_more_feature_2_desc'),
        },
        {
          icon: Smartphone,
          title: t('learn_more_feature_3_title'),
          description: t('learn_more_feature_3_desc'),
        },
        {
          icon: BellRing,
          title: t('learn_more_feature_4_title'),
          description: t('learn_more_feature_4_desc'),
        },
        {
          icon: ShieldCheck,
          title: t('learn_more_feature_5_title'),
          description: t('learn_more_feature_5_desc'),
        },
        {
          icon: Languages,
          title: t('learn_more_feature_6_title'),
          description: t('learn_more_feature_6_desc'),
        },
      ];
    
      return (
        <>
          <Helmet>
            <title>{t('learn_more')} - {t('wanz_req')}</title>
            <meta name="description" content={t('meta_description_learn_more')} />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                {t('learn_more_title')}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('learn_more_subtitle')}
              </p>
            </div>
    
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full glassmorphism hover:border-primary/50 transition-colors duration-300">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      );
    };
    
    export default LearnMorePage;