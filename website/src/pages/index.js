import React, { useEffect } from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme/Footer';
import LandingHeader from '@site/src/components/LandingHeader';
import Hero from '@site/src/components/Hero';
import About from '@site/src/components/About';
import Workflow from '@site/src/components/Workflow';
import Contributors from '@site/src/components/Contributors';
import styles from './index.module.css';

export default function Home() {
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  // Set dark background on html/body for landing page to prevent white overscroll
  useEffect(() => {
    const originalBgColor = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = '#121212';
    
    return () => {
      document.documentElement.style.backgroundColor = originalBgColor;
    };
  }, []);

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
          <About />
        </section>

        <section id="workflow" className={styles.section}>
          <Workflow />
        </section>

        <section id="contributors" className={styles.section}>
          <div className={styles.sectionContent}>
            <Contributors />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
