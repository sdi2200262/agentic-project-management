import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'AI-Powered',
    description: (
      <>
        Leverage AI agents to break down complex projects and manage workflows intelligently.
      </>
    ),
  },
  {
    title: 'Agent-Based',
    description: (
      <>
        Specialized agents work together to handle different phases of your project lifecycle.
      </>
    ),
  },
  {
    title: 'CLI-First',
    description: (
      <>
        Simple command-line interface that integrates seamlessly with your workflow.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

