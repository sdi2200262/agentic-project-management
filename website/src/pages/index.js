import React from 'react';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  const history = useHistory();

  const handleGoToDocs = () => {
    history.push('/docs');
  };

  return (
    <Layout title="Agentic Project Management" description="AI-powered project management CLI tool">
      <div className={styles.landingPage}>
        <button className={styles.docsButton} onClick={handleGoToDocs}>
          Go to Docs
        </button>
      </div>
    </Layout>
  );
}
