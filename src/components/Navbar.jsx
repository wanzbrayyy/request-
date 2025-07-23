
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Wanz Req
            </motion.div>
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    {t('dashboard')}
                  </Button>
                </Link>
                <Link to="/inbox">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <i className="fas fa-inbox mr-2"></i>
                    {t('inbox')}
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <i className="fas fa-cog mr-2"></i>
                    {t('settings')}
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <i className="fas fa-user-plus mr-2"></i>
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
