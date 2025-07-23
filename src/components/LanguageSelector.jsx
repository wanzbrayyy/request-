
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAllLanguages } from '@/utils/languages';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const allLanguages = getAllLanguages();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 transition-all duration-300"
        >
          <i className="fas fa-globe mr-2"></i>
          {language.flag}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            <i className="fas fa-globe mr-2 text-purple-400"></i>
            Select Language
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {allLanguages.map((lang) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  currentLanguage === lang.code
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium truncate">{lang.name}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
