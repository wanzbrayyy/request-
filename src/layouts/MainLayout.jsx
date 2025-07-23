
import React from 'react';
    import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { useAuth } from '@/contexts/AuthContext';
    import { Button } from '@/components/ui/button';
    import LanguageSwitcher from '@/components/LanguageSwitcher';
    import BottomNav from '@/components/BottomNav';
    import { Mail, ArrowLeft, Send } from 'lucide-react';
    
    const MainLayout = () => {
      const { t } = useTranslation();
      const { currentUser, logout } = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
    
      const handleLogout = () => {
        logout();
        navigate('/');
      };
    
      const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';
    
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/50 to-slate-900 text-white">
          <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                {showBackButton && (
                  <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                )}
                <Link to="/" className="text-2xl font-bold text-primary font-heading">
                  {t('wanz_req')}
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                {currentUser && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dm')}>
                      <Send className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                      <Mail className="h-6 w-6" />
                    </Button>
                  </>
                )}
                {currentUser ? (
                  <Button onClick={handleLogout} variant="secondary">{t('logout')}</Button>
                ) : (
                  <Button asChild>
                    <Link to="/login">{t('login')}</Link>
                  </Button>
                )}
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
            <Outlet />
          </main>
          {currentUser && <BottomNav />}
        </div>
      );
    };
    
    export default MainLayout;
