import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IconSuggestions } from 'assets/suggestions';
import { CategoryType, FeedbacksDataType, SortByType } from 'types';
import { arrSortBy, categories as categoriesData } from 'data';
import {
  Heading,
  Text,
  Feedback,
  ImageResponsive,
  Dropdown,
  Button,
} from 'components';
import styles from 'styles/Home.module.scss';

interface Props {
  feedbacksData: FeedbacksDataType;
  sortBy: SortByType;
  upvoted: number[];
  onFeedbackUpvote: (id: number) => void;
}

export default function Home(props: Props) {
  const { feedbacksData, sortBy, upvoted, onFeedbackUpvote } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<'All' | CategoryType[]>('All');

  const handleSortBy = (newSortBy: SortByType) => {
    if (sortBy === newSortBy) return;

    setSearchParams((params) => {
      params.set('sortBy', newSortBy);
      return params;
    });
  };

  const handleToggleCategory = (category: CategoryType) => {
    setCategories((state) => {
      if (state === 'All') return [category];

      const index = state.indexOf(category);

      if (index === -1) {
        return [...state, category];
      }

      return state.length === 1
        ? state
        : [...state.slice(0, index), ...state.slice(index + 1)];
    });
  };

  const suggestionsRender =
    categories === 'All'
      ? feedbacksData.Suggestion
      : feedbacksData.Suggestion.filter((suggestion) =>
          categories.includes(suggestion.category)
        );

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles['header__title']}>
          <ImageResponsive
            desktop={{ path: 'assets/suggestions/desktop/background-header.png' }}
            tablet={{ path: 'assets/suggestions/tablet/background-header.png' }}
            mobile={{ path: 'assets/suggestions/mobile/background-header.png' }}
            className={styles['header__title-img']}
          />
          <div className={styles['header__title-text']}>
            <Heading level="1" styleLevel="2">
              Frontend Mentor
            </Heading>
            <Text tag="span" variant="2">
              Feedback Board
            </Text>
          </div>
        </div>
        <div className={`element-rounded ${styles['header__categories']}`}>
          <Button
            variant="5"
            active={categories === 'All'}
            className={styles['header__categories-btn']}
            onClick={() => setCategories('All')}
          >
            All
          </Button>
          {categoriesData.map((category) => (
            <Button
              key={category}
              variant="5"
              active={Array.isArray(categories) && categories.includes(category)}
              className={styles['header__categories-btn']}
              onClick={() => handleToggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className={`element-rounded ${styles.roadmap}`}>
          <div className={styles['roadmap__heading-wrapper']}>
            <Heading level="3" className={styles['roadmap__heading']}>
              Roadmap
            </Heading>
            <Link to="/roadmap" className={styles['roadmap-anchor']}>
              View
            </Link>
          </div>

          <ul className={styles['roadmap__list']}>
            <li
              className={`${styles['roadmap__item']} ${styles['roadmap__item-planned']}`}
            >
              <div className={styles.circle} />
              <Text tag="p" variant="1">
                Planned
              </Text>
              <Text tag="span" variant="1" className={styles['roadmap__item-num']}>
                {feedbacksData.Planned.length}
              </Text>
            </li>
            <li
              className={`${styles['roadmap__item']} ${styles['roadmap__item-inprogress']}`}
            >
              <div className={styles.circle} />
              <Text tag="p" variant="1">
                In-Progress
              </Text>
              <Text tag="span" variant="1" className={styles['roadmap__item-num']}>
                {feedbacksData['In-Progress'].length}
              </Text>
            </li>
            <li
              className={`${styles['roadmap__item']} ${styles['roadmap__item-live']}`}
            >
              <div className={styles.circle} />
              <Text tag="p" variant="1">
                Live
              </Text>
              <Text tag="span" variant="1" className={styles['roadmap__item-num']}>
                {feedbacksData.Live.length}
              </Text>
            </li>
          </ul>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles['content__header']}>
            <div className={styles['content__header-suggestions']}>
              <IconSuggestions className={styles['content__header-icon']} />
              <Heading level="2" styleLevel="3">
                {suggestionsRender.length} Suggestions
              </Heading>
            </div>
            <Dropdown
              items={arrSortBy.map((sortBy) => ({
                value: sortBy,
              }))}
              selected={sortBy}
              onSelect={(sortBy) => handleSortBy(sortBy as SortByType)}
              classNameWrapper={styles['content__header-dropdown']}
            >
              <Text tag="span" variant="2">
                Sort by : <span className="bold">{sortBy}</span>
              </Text>
            </Dropdown>
            <Button variant="1">+ Add Feedback</Button>
          </div>
          <ul className={styles.feedbacks}>
            {suggestionsRender.map((suggestion) => (
              <li key={suggestion.id} className={styles['feedbacks__item']}>
                <Feedback
                  isUpvoted={upvoted.includes(suggestion.id)}
                  onUpvote={onFeedbackUpvote}
                  attachAnchor
                  {...suggestion}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
