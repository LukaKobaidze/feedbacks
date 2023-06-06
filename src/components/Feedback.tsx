import { FeedbackType, FeedbacksDataType } from 'types';
import Button from './Button';
import { IconArrowUp, IconComments } from 'assets/shared';
import styles from 'styles/Feedback.module.scss';
import Heading from './Heading';
import Text from './Text';
import { Link, LinkProps } from 'react-router-dom';
import { getTotalComments } from 'helpers';

type Props = FeedbackType &
  Omit<LinkProps, 'to' | 'id' | 'title'> & {
    isUpvoted: boolean;
    status?: keyof FeedbacksDataType;
    onUpvote?: (id: number) => void;
    attachAnchor?: boolean;
    disableUpvote?: boolean;
  } & ({ variant?: '1' } | { variant?: '2' });

export default function Feedback(props: Props) {
  const {
    variant = '1',
    isUpvoted,
    status,
    onUpvote,
    id,
    title,
    description,
    category,
    upvotes,
    comments,
    attachAnchor,
    disableUpvote,
    className,
    style,
    ...restProps
  } = props;

  const handleUpvoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onUpvote && onUpvote(id);
  };

  const contentJsx = (
    <>
      <Button
        variant="5"
        active={isUpvoted}
        className={`${styles.upvote} ${isUpvoted ? styles.active : ''}`}
        onClick={handleUpvoteClick}
        disabled={!onUpvote}
      >
        <IconArrowUp className={styles['upvote__icon']} />
        <span>{isUpvoted ? upvotes + 1 : upvotes}</span>
      </Button>
      <div className={styles['text-wrapper']}>
        {status && status !== 'Suggestion' && (
          <div className={styles.status}>
            <Text tag="span" variant="1">
              {status}
            </Text>
          </div>
        )}
        <Heading level="3" className={styles['text-wrapper__title']}>
          {title}
        </Heading>
        <Text tag="p" variant="1" className={styles['text-wrapper__description']}>
          {description}
        </Text>
        <Button
          variant="5"
          active={false}
          className={styles['text-wrapper__category']}
          disabled
        >
          {category}
        </Button>
      </div>
      <div
        className={`${styles.comments} ${
          (comments?.length || 0) === 0 ? styles['comments--none'] : ''
        }`}
      >
        <IconComments className={styles['comments__icon']} />
        <Text tag="span" variant="1">
          {getTotalComments(comments)}
        </Text>
      </div>
    </>
  );

  const containerStyle = {
    '--status-color':
      status === 'Planned'
        ? '#F49F85'
        : status === 'In-Progress'
        ? '#AD1FEA'
        : status === 'Live'
        ? '#62BCFA'
        : '',
    ...style,
  } as React.CSSProperties;

  return attachAnchor ? (
    <Link
      to={'/' + id}
      className={`element-rounded ${styles.container} ${
        styles[`container--${variant}`]
      } ${styles['container--anchor']} ${className}`}
      style={containerStyle}
      {...restProps}
    >
      {contentJsx}
    </Link>
  ) : (
    <div
      className={`element-rounded ${styles.container} ${
        styles[`container--${variant}`]
      }`}
      style={containerStyle}
    >
      {contentJsx}
    </div>
  );
}
