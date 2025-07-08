import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Database, Server, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

interface Status {
  name: string;
  status: 'checking' | 'connected' | 'error';
  message: string;
  icon: React.ReactNode;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [statuses, setStatuses] = useState<Status[]>([
    {
      name: 'Backend API',
      status: 'checking',
      message: 'Checking connection...',
      icon: <Server className="w-4 h-4" />
    },
    {
      name: 'Supabase Database',
      status: 'checking',
      message: 'Checking connection...',
      icon: <Database className="w-4 h-4" />
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    // Check Backend API
    try {
      const response = await fetch('http://localhost:3000/api/health');
      if (response.ok) {
        const data = await response.json();
        updateStatus(0, 'connected', `Connected (${data.status})`);
      } else {
        updateStatus(0, 'error', 'Not responding');
      }
    } catch (error) {
      updateStatus(0, 'error', 'Connection failed');
    }

    // Check Supabase through backend
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/test');
      if (response.ok) {
        updateStatus(1, 'connected', 'Connected');
      } else {
        updateStatus(1, 'error', 'Database error');
      }
    } catch (error) {
      updateStatus(1, 'error', 'Connection failed');
    }
  };

  const updateStatus = (index: number, status: 'checking' | 'connected' | 'error', message: string) => {
    setStatuses(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          status,
          message,
          icon: status === 'connected' ? <CheckCircle className="w-4 h-4" /> :
                 status === 'error' ? <XCircle className="w-4 h-4" /> :
                 <AlertCircle className="w-4 h-4" />
        };
      }
      return item;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  const allConnected = statuses.every(s => s.status === 'connected');
  const hasErrors = statuses.some(s => s.status === 'error');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-3 rounded-lg shadow-lg transition-all duration-300 ${
            allConnected ? 'bg-green-500 hover:bg-green-600' :
            hasErrors ? 'bg-red-500 hover:bg-red-600' :
            'bg-yellow-500 hover:bg-yellow-600'
          } text-white`}
        >
          {allConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        </button>

        {/* Status Text */}
        <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
          allConnected ? 'bg-green-500 text-white' :
          hasErrors ? 'bg-red-500 text-white' :
          'bg-yellow-500 text-white'
        }`}>
          {allConnected ? 'All Connected' :
           hasErrors ? 'Connection Issues' :
           'Checking...'}
        </div>
      </div>

      {/* Expanded Status Panel */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Connection Status</h3>
            <button
              onClick={() => checkConnections()}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3">
            {statuses.map((status, index) => (
              <div
                key={status.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStatusBg(status.status)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={getStatusColor(status.status)}>
                    {status.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{status.name}</p>
                    <p className={`text-sm ${getStatusColor(status.status)}`}>
                      {status.message}
                    </p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  status.status === 'connected' ? 'bg-green-500' :
                  status.status === 'error' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`} />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Status:</span>
              <span className={`font-medium ${
                allConnected ? 'text-green-600' :
                hasErrors ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {allConnected ? 'All Systems Operational' :
                 hasErrors ? 'Some Issues Detected' :
                 'Checking Connections'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConnectionStatus; 