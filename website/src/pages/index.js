import React from 'react';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import '../css/landing.css';

export default function Home() {
  const history = useHistory();

  const navigateToDocs = () => {
    history.push('/docs');
  };

  return (
    <Layout>
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-header__logo">
          Agentic PM
        </Link>
        <span className="landing-header__divider">|</span>
        <Link to="/docs" className="landing-header__link">
          Documentation
        </Link>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <h1 className="landing-title">
          Agentic Project Management
        </h1>
        
        <p className="landing-subtitle">
          AI-powered project management CLI tool
        </p>

        <button onClick={navigateToDocs} className="landing-cta">
          Get Started
        </button>

        {/* Features Grid */}
        <div className="landing-features">
          <div className="landing-feature-card">
            <h3 className="landing-feature-card__title">AI-Powered</h3>
            <p className="landing-feature-card__description">
              Leverage AI agents to break down complex projects and manage workflows intelligently
            </p>
          </div>

          <div className="landing-feature-card">
            <h3 className="landing-feature-card__title">Agent-Based</h3>
            <p className="landing-feature-card__description">
              Specialized agents work together to handle different phases of your project lifecycle
            </p>
          </div>

          <div className="landing-feature-card">
            <h3 className="landing-feature-card__title">CLI-First</h3>
            <p className="landing-feature-card__description">
              Simple command-line interface that integrates seamlessly with your workflow
            </p>
          </div>
        </div>
      </main>

      {/* Footer is rendered by theme Footer globally */}
    </div>
    </Layout>
  );
}
