import React from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme/Footer';
import styles from './index.module.css';

export default function Home() {
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  const handleGoToDocs = () => {
    // Construct the correct docs URL with baseUrl
    const docsUrl = `${baseUrl.replace(/\/$/, '')}/docs`;
    history.push(docsUrl);
  };

  return (
    <div className={styles.landingPage}>
      <main className={styles.mainContent}>
        <button className={styles.docsButton} onClick={handleGoToDocs}>
          Go to Docs
        </button>
      </main>
      <Footer />
    </div>
  );
}
