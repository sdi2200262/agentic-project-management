import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';
import packageJson from '../../../../package.json';
import { useStats } from '@site/src/hooks/useStats';
import { formatNumber } from '@site/src/utils/format';
import { canvasPath, wigglePreset } from 'blobs/v2/animate';

export default function Hero() {
  const [copied, setCopied] = React.useState(false);
  const [blobReady, setBlobReady] = React.useState(false);
  const { githubStars, npmDownloads, isLoading } = useStats();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(null);
  const isVisibleRef = useRef(true);
  const isMobileRef = useRef(false);
  const renderFrameRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g agentic-pm');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect mobile and visibility
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Note: Mobile blob rendering removed to reduce code complexity

  // Pause animation when not visible
  useEffect(() => {
    const heroWrapper = document.querySelector('[class*="heroWrapper"]');
    if (!heroWrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        isVisibleRef.current = isVisible;
        
        // Pause animations when off-screen
        if (!isVisible) {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
          }
        } else {
          // Resume animation when back on-screen
          if (renderFrameRef.current && !frameRef.current) {
            frameRef.current = requestAnimationFrame(renderFrameRef.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroWrapper);
    return () => observer.disconnect();
  }, []);

  // Desktop blob - only run on desktop
  useEffect(() => {
    if (isMobileRef.current) return; // Skip on mobile
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - responsive for desktop
    const width = Math.min(1320, window.innerWidth);
    const height = Math.min(695, window.innerHeight * 0.8);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
    
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Create animation with default timestamp provider
    const animation = canvasPath();
    animationRef.current = animation;

    // Load pattern image
    let fillPattern = null;
    const patternImage = new Image();
    patternImage.crossOrigin = 'anonymous';
    
    // Set up pattern once image loads
    patternImage.onload = () => {
      try {
        fillPattern = ctx.createPattern(patternImage, 'no-repeat');
        if (fillPattern && fillPattern.setTransform) {
          try {
            const scaleX = width / patternImage.width;
            const scaleY = height / patternImage.height;
            const matrix = new DOMMatrix();
            matrix.scaleSelf(scaleX, scaleY);
            fillPattern.setTransform(matrix);
          } catch (e) {
            // Fallback if setTransform fails
            console.warn('Pattern transform not supported, using default');
          }
        }
        
        requestAnimationFrame(renderFrame);
        setBlobReady(true);
      } catch (e) {
        console.warn('Failed to create pattern:', e);
        fillPattern = null;
        // Still start render loop with fallback
        requestAnimationFrame(renderFrame);
      }
    };
    
    patternImage.onerror = () => {
      console.warn('Failed to load blob image pattern from:', patternImage.src);
      fillPattern = null;
      requestAnimationFrame(renderFrame);
      setBlobReady(true);
    };
    
    patternImage.src = '/agentic-project-management/img/blobimg.png';

    const baseSize = Math.min(width, height); 
    
    // Initialize with wiggle animation 
    wigglePreset(
      animation,
      {
        extraPoints: 8,
        randomness: 4,
        seed: Math.random(),
        size: baseSize,
      },
      {
        offsetX: (width - baseSize) / 2,
        offsetY: (height - baseSize) / 2,
      },
      {
        speed: 2, 
        initialTransition: 500, 
      }
    );

    const renderFrame = () => {
      if (!isVisibleRef.current) {
        frameRef.current = null;
        return; // Don't render when off-screen
      }
      
      ctx.clearRect(0, 0, width, height);
      
      if (fillPattern) {
        ctx.fillStyle = fillPattern;
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ec576b');
        gradient.addColorStop(1, '#ff6b7a');
        ctx.fillStyle = gradient;
      }
      
      ctx.fill(animation.renderFrame());
      frameRef.current = requestAnimationFrame(renderFrame);
    };
    
    // Store renderFrame in ref so it can be accessed by IntersectionObserver
    renderFrameRef.current = renderFrame;
    
    // Start the animation loop
    frameRef.current = requestAnimationFrame(renderFrame);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);


  return (
    <div className={styles.heroWrapper}>
      <canvas 
        ref={canvasRef} 
        className={`${styles.blob} ${blobReady ? styles.blobVisible : ''}`} 
      />
      <div className={styles.heroContent}>
      <div className={styles.topLeft}>
        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine1}>Agentic</span>
          <span className={styles.titleLine2}>Project</span>
          <span className={styles.titleLine3}>Management</span>
        </h1>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.heroVersion}>Currently:</span>
            <span className={styles.statValue}>v{packageJson.version}</span>
          </div>
          {npmDownloads !== null && (
            <div className={styles.statItem}>
              <span className={styles.heroVersion}>NPM:</span>
              <span className={styles.statValue}>
                {formatNumber(npmDownloads)} this week
              </span>
            </div>
          )}
          {githubStars !== null && (
            <div className={styles.statItem}>
              <span className={styles.heroVersion}>GitHub:</span>
              <span className={styles.statValue}>{formatNumber(githubStars)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.centerButtons}>
        <div className={styles.installCommand}>
          <code className={styles.commandText}>$ npm install -g agentic-pm</code>
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
              </svg>
            )}
          </button>
        </div>
        <a
          href="https://github.com/sdi2200262/agentic-project-management"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubButton}
        >
          View on GitHub
        </a>
      </div>

      <div className={styles.quoteContainer}>
        <p className={styles.bottomRight}>
          Manage complex projects<br />
          with a team of AI assistants,<br />
          smoothly and efficiently.
        </p>
      </div>
      </div>
    </div>
  );
}
