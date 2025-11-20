import React from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme/Footer';
import LandingHeader from '@site/src/components/LandingHeader';
import Hero from '@site/src/components/Hero';
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
      <div className={styles.contentWrapper}>
        <LandingHeader />
        
        <section id="home" className={styles.section}>
          <Hero />
        </section>

        <section id="about" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2>About</h2>
            <p>Content for About section</p>
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2>Features</h2>
            <p>Content for Features section</p>
          </div>
        </section>

        <section id="contributors" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2>Contributors</h2>
            <p>Content for Contributors section</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
