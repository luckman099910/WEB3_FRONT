import React from 'react';
import HandScanRegister from '../components/HandScanRegister';

const HandRegisterPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#10131c] flex flex-col justify-center items-center">
      <HandScanRegister demoMode={true} />
    </div>
  );
};

export default HandRegisterPage; 