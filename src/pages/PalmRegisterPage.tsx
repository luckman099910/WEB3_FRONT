import React from 'react';
import Layout from '../components/Layout';
import HandScanRegister from '../components/HandScanRegister';

const PalmRegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <HandScanRegister />
      </div>
    </Layout>
  );
};

export default PalmRegisterPage; 