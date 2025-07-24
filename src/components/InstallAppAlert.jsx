import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const InstallAppAlert = ({ onInstall }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg flex items-center justify-between shadow-lg my-4">
      <div>
        <h3 className="font-bold">Get More Features!</h3>
        <p className="text-sm">Install the app to get 20 extra hits and a better experience.</p>
      </div>
      <Button onClick={onInstall} variant="secondary">
        <Download className="mr-2 h-4 w-4" />
        Install App
      </Button>
    </div>
  );
};

export default InstallAppAlert;
