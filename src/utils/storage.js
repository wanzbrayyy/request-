
// File storage utilities
export const uploadFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result,
        uploadedAt: new Date().toISOString()
      };
      
      // Store in localStorage for demo
      const files = JSON.parse(localStorage.getItem('wanzreq_files') || '[]');
      files.push(fileData);
      localStorage.setItem('wanzreq_files', JSON.stringify(files));
      
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
};

export const getFile = (fileId) => {
  const files = JSON.parse(localStorage.getItem('wanzreq_files') || '[]');
  return files.find(file => file.id === fileId);
};

export const deleteFile = (fileId) => {
  const files = JSON.parse(localStorage.getItem('wanzreq_files') || '[]');
  const updatedFiles = files.filter(file => file.id !== fileId);
  localStorage.setItem('wanzreq_files', JSON.stringify(updatedFiles));
};

// Message utilities
export const saveMessage = (message) => {
  const messages = JSON.parse(localStorage.getItem('wanzreq_messages') || '[]');
  const newMessage = {
    id: Date.now().toString(),
    ...message,
    timestamp: new Date().toISOString(),
    read: false
  };
  messages.unshift(newMessage);
  localStorage.setItem('wanzreq_messages', JSON.stringify(messages));
  return newMessage;
};

export const getMessages = (username) => {
  const messages = JSON.parse(localStorage.getItem('wanzreq_messages') || '[]');
  return messages.filter(msg => msg.recipient === username);
};

export const markMessageAsRead = (messageId) => {
  const messages = JSON.parse(localStorage.getItem('wanzreq_messages') || '[]');
  const updatedMessages = messages.map(msg => 
    msg.id === messageId ? { ...msg, read: true } : msg
  );
  localStorage.setItem('wanzreq_messages', JSON.stringify(updatedMessages));
};

// User utilities
export const getUsers = () => {
  return JSON.parse(localStorage.getItem('wanzreq_users') || '[]');
};

export const saveUser = (user) => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.username === user.username);
  
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push({
      id: Date.now().toString(),
      ...user,
      createdAt: new Date().toISOString(),
      isPremium: false,
      hitsRemaining: 10
    });
  }
  
  localStorage.setItem('wanzreq_users', JSON.stringify(users));
  return users[existingIndex >= 0 ? existingIndex : users.length - 1];
};

export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

// Hit tracking utilities
export const trackHit = (username, hitData) => {
  const hits = JSON.parse(localStorage.getItem('wanzreq_hits') || '[]');
  const newHit = {
    id: Date.now().toString(),
    username,
    ...hitData,
    timestamp: new Date().toISOString()
  };
  hits.unshift(newHit);
  localStorage.setItem('wanzreq_hits', JSON.stringify(hits));
  
  // Update user's remaining hits
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex >= 0 && !users[userIndex].isPremium) {
    users[userIndex].hitsRemaining = Math.max(0, (users[userIndex].hitsRemaining || 10) - 1);
    localStorage.setItem('wanzreq_users', JSON.stringify(users));
  }
  
  return newHit;
};

export const getHits = (username) => {
  const hits = JSON.parse(localStorage.getItem('wanzreq_hits') || '[]');
  return hits.filter(hit => hit.username === username);
};
