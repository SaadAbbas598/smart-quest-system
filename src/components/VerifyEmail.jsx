import React from 'react';

const EmailVerifyActivateAccount = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">Email Sent</h2>
        <p className="text-gray-700 text-lg mb-6">
          Please check your Gmail inbox and click on the activation link to complete the process.
        </p>
        <div className="text-gray-500 text-sm">
          <p>If you don't see the email, please check your spam folder.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyActivateAccount;
