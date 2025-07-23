import React, { useState } from 'react';
    import { useTranslation } from 'react-i18next';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
    import { Globe } from 'lucide-react';
    
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'id', name: 'Bahasa Indonesia' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'ja', name: '日本語' },
      { code: 'zh', name: '中文' },
      { code: 'ar', name: 'العربية' },
      { code: 'ru', name: 'Русский' },
      { code: 'pt', name: 'Português' },
    ];
    
    const LanguageSwitcher = () => {
      const { i18n, t } = useTranslation();
      const [open, setOpen] = useState(false);
    
      const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setOpen(false);
      };
    
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glassmorphism">
            <DialogHeader>
              <DialogTitle>{t('select_language')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={i18n.language === lang.code ? 'default' : 'outline'}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    };
    
    export default LanguageSwitcher;