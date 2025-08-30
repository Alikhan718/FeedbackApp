import React from 'react';
import { Helmet } from 'react-helmet';

const ClientSettings = () => (
  <div>
    <Helmet>
      <title>Client Settings | Feedback App</title>
    </Helmet>
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p>This is where you will be able to manage your account settings.</p>
  </div>
);

export default ClientSettings; 