
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fas fa-user-secret',
      title: t('anonymousTitle'),
      description: t('anonymousDesc')
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: t('trackingTitle'),
      description: t('trackingDesc')
    },
    {
      icon: 'fas fa-shield-alt',
      title: t('secureTitle'),
      description: t('secureDesc')
    }
  ];

  return (
    <>
      <Helmet>
        <title>Wanz Req - Anonymous Messages Made Simple</title>
        <meta name="description" content="Receive honest feedback and messages anonymously with advanced tracking features. Free and premium plans available." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3">
                    <i className="fas fa-rocket mr-2"></i>
                    {t('getStarted')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-lg px-8 py-3">
                  <i className="fas fa-info-circle mr-2"></i>
                  {t('learnMore')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-white">{t('featuresTitle')}</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <i className={`${feature.icon} text-2xl text-white`}></i>
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-white">{t('pricingTitle')}</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-600">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <i className="fas fa-gift text-2xl text-white"></i>
                    </div>
                    <CardTitle className="text-white text-2xl">{t('freeTitle')}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {t('freeDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white mb-4">
                      <i className="fas fa-gift mr-2 text-gray-400"></i>
                      FREE
                    </div>
                    <Link to="/register">
                      <Button className="w-full bg-gray-700 hover:bg-gray-600">
                        <i className="fas fa-user-plus mr-2"></i>
                        {t('getStarted')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border-purple-400 relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      <i className="fas fa-crown mr-1"></i>
                      POPULAR
                    </span>
                  </div>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-crown text-2xl text-white"></i>
                    </div>
                    <CardTitle className="text-white text-2xl">{t('premiumTitle')}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {t('premiumDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white mb-4">
                      {t('price')}
                    </div>
                    <Link to="/register">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <i className="fas fa-rocket mr-2"></i>
                        {t('upgrade')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who trust Wanz Req for anonymous messaging
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3">
                  <i className="fas fa-rocket mr-2"></i>
                  {t('getStarted')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
