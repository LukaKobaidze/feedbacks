import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CategoryType, FeedbacksDataType, SortByType } from 'types';
import { arrSortBy, categories as categoriesData } from 'data';
import {
  IconSuggestions,
  illustrationEmpty,
  backgroundHeaderDesktop,
  backgroundHeaderTablet,
  backgroundHeaderMobile,
} from 'assets/suggestions';
import {
  Heading,
  Text,
  Feedback,
  ImageResponsive,
  Dropdown,
  Button,
} from 'components';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/Home.module.scss';

interface Props {
  feedbacksData: FeedbacksDataType;
  sortBy: SortByType;
  upvoted?: number[];
  onFeedbackUpvote: (id: number) => void;
}

export default function Home(props: Props) {
  const { feedbacksData, sortBy, upvoted = [], onFeedbackUpvote } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsCategories = searchParams.get('categories');
  const categories = !searchParamsCategories
    ? 'All'
    : (searchParamsCategories.split(',') as CategoryType[]);

  useEffect(() => {
    document.title = 'Product Feedback | LukaKobaidze';
  }, []);

  const handleSortBy = (newSortBy: SortByType) => {
    if (sortBy === newSortBy) return;

    setSearchParams((params) => {
      params.set('sortBy', newSortBy);
      return params;
    });
  };

  const handleToggleCategory = (category: CategoryType) => {
    setSearchParams((params) => {
      if (categories === 'All') {
        params.set('categories', category);
      } else {
        const index = categories.indexOf(category);

        if (index === -1) {
          params.set('categories', [...categories, category].join(','));
        } else if (categories.length > 1) {
          params.set(
            'categories',
            [...categories.slice(0, index), ...categories.slice(index + 1)].join(',')
          );
        }
      }
      return params;
    });
  };

  const suggestionsRender =
    categories === 'All'
      ? feedbacksData.Suggestion
      : feedbacksData.Suggestion.filter((suggestion) =>
          categories.includes(suggestion.category)
        );

  const roadmapDisabled =
    feedbacksData.Planned.length === 0 &&
    feedbacksData['In-Progress'].length === 0 &&
    feedbacksData.Live.length === 0;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header} aria-label='header'>
        <div className={styles['header__title']}>
          <ImageResponsive
            desktop={{ path: backgroundHeaderDesktop }}
            tablet={{ path: backgroundHeaderTablet }}
            mobile={{ path: backgroundHeaderMobile }}
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
        <div
          className={`element-rounded ${styles['header__categories']}`}
          aria-label="categories"
        >
          <Button
            variant="5"
            active={categories === 'All'}
            className={styles['header__categories-btn']}
            onClick={() =>
              setSearchParams((params) => {
                params.delete('categories');
                return params;
              })
            }
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

        <div className={`element-rounded ${styles.roadmap}`} aria-label="roadmap">
          <div className={styles['roadmap__heading-wrapper']}>
            <Heading level="3" className={styles['roadmap__heading']}>
              Roadmap
            </Heading>
            <Link
              to="/roadmap"
              className={`${styles['roadmap-anchor']} ${
                roadmapDisabled ? styles['roadmap-anchor--disabled'] : ''
              }`}
              tabIndex={roadmapDisabled ? -1 : undefined}
              aria-disabled={roadmapDisabled}
            >
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
      <main className={styles.main} aria-label="main">
        <div className={styles.content}>
          <div className={styles['content__header']}>
            <div className={styles['content__header-suggestions']}>
              <IconSuggestions className={styles['content__header-icon']} />
              <Heading level="2" styleLevel="3">
                {suggestionsRender.length} Suggestions
              </Heading>
            </div>
            {sortBy && (
              <Dropdown
                items={arrSortBy.map((sortBy) => ({
                  value: sortBy,
                }))}
                selected={sortBy}
                onSelect={(sortBy) => handleSortBy(sortBy as SortByType)}
                classNameWrapper={styles['content__header-dropdown']}
                aria-label="sort by"
              >
                <Text tag="span" variant="2">
                  Sort by : <span className="bold">{sortBy}</span>
                </Text>
              </Dropdown>
            )}
            <Link
              to="/new"
              className={`${buttonStyles.button} ${buttonStyles['button--1']} ${styles['content__header-add-feedback']}`}
            >
              + Add Feedback
            </Link>
          </div>

          {suggestionsRender.length !== 0 ? (
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
          ) : (
            <div className={`element-rounded ${styles['feedbacks-empty']}`}>
              <div className={styles['feedbacks-empty-wrapper']}>
                <div className={styles['feedbacks-empty__illustration-wrapper']}>
                  <img
                    src={illustrationEmpty}
                    alt=""
                    className={styles['feedbacks-empty__illustration']}
                  />
                </div>

                <Heading
                  level="3"
                  styleLevel="1"
                  className={styles['feedbacks-empty__heading']}
                >
                  There is no feedback yet.
                </Heading>
                <Text
                  tag="p"
                  variant="1"
                  className={styles['feedbacks-empty__paragraph']}
                >
                  Got a suggestion? Found a bug that needs to be squashed? We love
                  hearing about new ideas to improve our app.
                </Text>
                <Link
                  to="/new"
                  className={`${buttonStyles.button} ${buttonStyles['button--1']} ${styles['content__header-add-feedback']}`}
                >
                  + Add Feedback
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
