import React from 'react';
import styles from './styles.module.css';
import { useContributors } from '@site/src/hooks/useContributors';
import { formatNumber } from '@site/src/utils/format';

export default function Contributors() {
  const { contributors, isLoading, error } = useContributors();

  if (isLoading) {
    return (
      <div className={styles.contributorsSection}>
        <h2 className={styles.title}>Contributors</h2>
        <div className={styles.loading}>Loading contributors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contributorsSection}>
        <h2 className={styles.title}>Contributors</h2>
        <div className={styles.error}>
          Unable to load contributors.{' '}
          <a
            href="https://github.com/sdi2200262/agentic-project-management/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className={styles.contributorsSection}>
        <h2 className={styles.title}>Contributors</h2>
        <div className={styles.error}>No contributors found.</div>
      </div>
    );
  }

  const MAX_DISPLAY = 12;
  const displayedContributors = contributors.slice(0, MAX_DISPLAY);
  const hasMore = contributors.length > MAX_DISPLAY;

  return (
    <div className={styles.contributorsSection}>
      <h2 className={styles.title}>Contributors</h2>
      <p className={styles.subtitle}>
        APM is an Open Source project, and contributions are welcome.
      </p>
      <p className={styles.subtitle}>
        Thank you to everyone who has contributed to this project!
      </p>
      <div className={styles.contributorsGrid}>
        {displayedContributors.map((contributor) => (
          <a
            key={contributor.id}
            href={contributor.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contributorCard}
          >
            <img
              src={contributor.avatarUrl}
              alt={contributor.login}
              className={styles.avatar}
              loading="lazy"
            />
            <div className={styles.contributorInfo}>
              <div className={styles.username}>{contributor.login}</div>
              <div className={styles.contributions}>
                {formatNumber(contributor.contributions)}{' '}
                {contributor.contributions === 1 ? 'contribution' : 'contributions'}
              </div>
            </div>
          </a>
        ))}
      </div>
      {hasMore && (
        <div className={styles.seeAllContainer}>
          <a
            href="https://github.com/sdi2200262/agentic-project-management/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.seeAllButton}
          >
            See all {contributors.length} contributors
          </a>
        </div>
      )}
    </div>
  );
}

