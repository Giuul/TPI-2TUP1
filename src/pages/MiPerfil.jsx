import React from 'react'
import Profile from '../components/Profile/Profile'

const MiPerfil = ({ username, userId, userRole, onAccountDelete }) => {
  return (
    <div>
      <Profile
        username={username}
        userId={userId}
        userRole={userRole}
        onAccountDelete={onAccountDelete}
      />
    </div>
  );
};

export default MiPerfil;