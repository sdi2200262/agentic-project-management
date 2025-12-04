import React from 'react';
import styles from './styles.module.css';

/**
 * Phase number box component
 * @param {Object} props - Component props
 * @param {number} props.phaseNumber - Phase number to display
 * @returns {JSX.Element} Phase box
 */
function PhaseBox({ phaseNumber }) {
  return (
    <div className={styles.phaseBox}>
      <div className={styles.phaseNumber}>{phaseNumber}</div>
    </div>
  );
}

/**
 * Individual workflow phase component
 * @param {Object} props - Component props
 * @param {number} props.phaseNumber - Phase number
 * @param {string} props.title - Phase title
 * @param {JSX.Element} props.description - Phase description content
 * @param {string} props.svgPath - Path to phase SVG image
 * @param {string} props.svgAlt - Alt text for SVG image
 * @param {boolean} props.isSetupPhase - Whether this is the setup phase
 * @param {boolean} props.isTaskLoopPhase - Whether this is the task loop phase
 * @param {string} props.docsUrl - URL to documentation (optional)
 * @returns {JSX.Element} Phase component
 */
export default function Phase({
  phaseNumber,
  title,
  description,
  svgPath,
  svgAlt,
  isSetupPhase,
  isTaskLoopPhase,
  docsUrl
}) {
  const isCentered = isSetupPhase || isTaskLoopPhase;
  const isReversed = isTaskLoopPhase;

  return (
    <div className={styles.phase}>
      <div className={`${styles.phaseContent} ${isCentered ? styles.phaseContentCentered : ''} ${isTaskLoopPhase ? styles.phaseContentTaskLoop : ''}`}>
        {isReversed ? (
          <>
            <div className={`${styles.phaseSvg} ${styles.phaseSvgRight}`}>
              <img
                src={svgPath}
                alt={svgAlt}
                className={`${styles.svgImage} ${styles.svgImageTaskLoop}`}
              />
              {isTaskLoopPhase && docsUrl && (
                <p className={styles.docsLinkMobile}>
                  For more details, see the <a href={docsUrl} className={styles.docsLink}>documentation</a>.
                </p>
              )}
            </div>
            <div className={`${styles.phaseTextColumn} ${styles.phaseTextColumnRight}`}>
              <div className={styles.phaseHeader}>
                <PhaseBox phaseNumber={phaseNumber} />
                <h3 className={styles.phaseTitle}>{title}</h3>
              </div>
              {description}
            </div>
          </>
        ) : (
          <>
            <div className={styles.phaseTextColumn}>
              <div className={styles.phaseHeader}>
                <PhaseBox phaseNumber={phaseNumber} />
                <h3 className={styles.phaseTitle}>{title}</h3>
              </div>
              {description}
            </div>
            <div className={styles.phaseSvg}>
              <img
                src={svgPath}
                alt={svgAlt}
                className={`${styles.svgImage} ${styles.svgImageSetup}`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
