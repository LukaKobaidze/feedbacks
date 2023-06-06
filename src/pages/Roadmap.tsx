import { useEffect } from 'react';
import { FeedbacksDataType } from 'types';
import buttonStyles from 'styles/Button.module.scss';
import { Feedback, GoBack, Heading, Text } from 'components';
import { Link } from 'react-router-dom';
import styles from 'styles/Roadmap.module.scss';

const renderStatus: {
  [key in keyof Omit<FeedbacksDataType, 'Suggestion'>]: {
    subtitle: string;
  };
} = {
  Planned: { subtitle: 'Ideas prioritized for research' },
  'In-Progress': { subtitle: 'Currently being developed' },
  Live: { subtitle: 'Released features' },
};

interface Props {
  data: FeedbacksDataType;
  upvoted: number[];
  onFeedbackUpvote: (id: number) => void;
}

export default function Roadmap(props: Props) {
  const { data, upvoted, onFeedbackUpvote } = props;

  useEffect(() => {
    document.title = 'Roadmap | Product Feedback';
  }, []);

  const statusKeys = Object.keys(renderStatus) as (keyof typeof renderStatus)[];
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles['heading-wrapper']}>
          <GoBack to="/" className={styles['go-back']} />
          <Heading level="1">Roadmap</Heading>
        </div>
        <Link
          to="/new"
          className={`${buttonStyles.button} ${buttonStyles['button--1']} ${styles['add-feedback']}`}
        >
          + Add Feedback
        </Link>
      </header>
      <main className={styles.main}>
        <ul className={styles['status-list']}>
          {statusKeys.map((status) => (
            <li key={status} className={styles.status}>
              <Heading level="2" styleLevel="3">
                {status} ({data[status].length})
              </Heading>
              <Text tag="p" variant="1" className={styles['status__subtitle']}>
                {renderStatus[status].subtitle}
              </Text>

              <ul className={styles['feedback-list']}>
                {data[status].map((feedbackData) => (
                  <li key={feedbackData.id} className={styles['feedback-item']}>
                    <Feedback
                      {...feedbackData}
                      isUpvoted={upvoted.includes(feedbackData.id)}
                      variant="2"
                      status={status}
                      onUpvote={onFeedbackUpvote}
                      attachAnchor
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
