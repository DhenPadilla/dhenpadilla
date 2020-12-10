import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import ContactInfo from 'components/ContactInfo';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="contact" />
      <ContactInfo />
    </Layout>
  );
};

export default ContactPage;
