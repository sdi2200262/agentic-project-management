import { useEffect } from 'react';
import Footer from '@theme/Footer';
import LandingHeader from '@site/src/components/LandingHeader';
import Hero from '@site/src/components/Hero';
import About from '@site/src/components/About';
import Workflow from '@site/src/components/Workflow';
import Contributors from '@site/src/components/Contributors';
import styles from './index.module.css';

/**
 * Home page component - main landing page with all sections
 * @returns {JSX.Element} Home page component
 */
export default function Home() {
  // Hide native scrollbar on landing page only
  useEffect(() => {
    // Add class to html element for CSS targeting
    document.documentElement.classList.add('landing-page-active');
    
    return () => {
      document.documentElement.classList.remove('landing-page-active');
    };
  }, []);

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
