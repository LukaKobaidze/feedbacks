import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FeedbacksDataType } from 'types';
import { Feedback, GoBack, Heading, PageContainer, Text } from 'components';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/Roadmap.module.scss';

const statusData: {
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
  upvoted?: number[];
  onFeedbackUpvote: (id: number) => void;
  windowWidth: number;
}

export default function Roadmap(props: Props) {
  const { data, upvoted = [], onFeedbackUpvote, windowWidth } = props;

  const navigate = useNavigate();
  const [statusActive, setStatusActive] = useState(0);

  const statusKeys = Object.keys(statusData) as (keyof typeof statusData)[];

  useEffect(() => {
    if (statusKeys.every((status) => data[status].length === 0)) {
      navigate('/', { replace: true });
    }

    document.title = 'Roadmap | Product Feedback';

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [statusActive]);

  const renderStatus = (status: keyof typeof statusData) => {
    return (
      <>
        <Heading level="2" styleLevel="3" className={styles['status__title']}>
          {status} ({data[status].length})
        </Heading>
        <Text tag="p" variant="1" className={styles['status__subtitle']}>
          {statusData[status].subtitle}
        </Text>

        <ul className={styles['status__list']}>
          {data[status].map((feedbackData) => (
            <li key={feedbackData.id} className={styles['status__item']}>
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
      </>
    );
  };

  return (
    <PageContainer className={styles.container}>
      <header className={styles.header}>
        <div className={styles['heading-wrapper']}>
          <GoBack className={styles['go-back']} />
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
        {windowWidth > 700 ? (
          <ul className={styles['status-list']}>
            {statusKeys.map((status) => (
              <li key={status} className={styles.status}>
                {renderStatus(status)}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className={styles['status-buttons-wrapper']}>
              <div
                className={styles['status-buttons']}
                style={
                  {
                    '--buttons-count': statusKeys.length,
                    '--button-active': statusActive,
                  } as React.CSSProperties
                }
              >
                {statusKeys.map((status, i) => (
                  <button
                    key={status}
                    className={`${styles['status-buttons__btn']} ${
                      i === statusActive ? styles.active : ''
                    }`}
                    onClick={() => setStatusActive(i)}
                  >
                    {status} ({data[status].length})
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.status}>
              {renderStatus(statusKeys[statusActive])}
            </div>
          </>
        )}
      </main>
    </PageContainer>
  );
}
