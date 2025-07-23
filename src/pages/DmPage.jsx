
import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTranslation } from 'react-i18next';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Send, Search } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    
    const DmPage = () => {
      const { currentUser } = useAuth();
      const { t } = useTranslation();
      const { toast } = useToast();
      const [users, setUsers] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
    
      useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(allUsers.filter(u => u.username !== currentUser.username));
      }, [currentUser.username]);
    
      const handleDm = (username) => {
        toast({
          title: `DM to ${username}`,
          description: t('feature_not_implemented'),
        });
      };
    
      const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      return (
        <>
          <Helmet>
            <title>Direct Messages - {t('wanz_req')}</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-2xl">Direct Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for a user..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.username}</span>
                        </div>
                        <Button size="sm" onClick={() => handleDm(user.username)}>
                          <Send className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No users found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      );
    };
    
    export default DmPage;
