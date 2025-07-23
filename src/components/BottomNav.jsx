
    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { LayoutDashboard, Settings, Crown } from 'lucide-react';
    
    const BottomNav = () => {
      const { t } = useTranslation();
    
      const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { to: '/upgrade', icon: Crown, label: t('upgrade_to_premium'), isCentral: true },
        { to: '/settings', icon: Settings, label: t('settings') },
      ];
    
      const navLinkClasses = "flex flex-col items-center justify-center text-muted-foreground transition-colors hover:text-primary";
      const activeLinkClasses = "text-primary";
    
      return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-t border-border md:hidden z-50">
          <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeLinkClasses : ''} ${item.isCentral ? '-mt-6' : ''}`
                }
              >
                {item.isCentral ? (
                  <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground shadow-lg">
                    <item.icon className="w-8 h-8" />
                  </div>
                ) : (
                  <item.icon className="w-6 h-6 mb-1" />
                )}
                <span className={`text-xs ${item.isCentral ? 'mt-1' : ''}`}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      );
    };
    
    export default BottomNav;
  