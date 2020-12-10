import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import Posts from 'components/Posts';

const BlogPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="projects" />
      <Posts />
    </Layout>
  );
};

export default BlogPage;
