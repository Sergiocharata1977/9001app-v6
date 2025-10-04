'use client';

import React from 'react';
import { User, Calendar, Building } from 'lucide-react';

interface UserInfoHeaderProps {
  userName?: string;
  organizationName?: string;
  lastLogin?: string;
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({
  userName = 'Usuario',
  organizationName = 'Organización',
  lastLogin = 'hoy'
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {userName}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {organizationName}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Último acceso: {lastLogin}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoHeader;