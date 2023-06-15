import { useEffect, useState } from 'react';
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
import { IconClose, IconHamburger } from 'assets/shared/mobile';
import {
  Heading,
  Text,
  Feedback,
  ImageResponsive,
  Dropdown,
  Button,
  PageContainer,
} from 'components';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/Home.module.scss';
import FocusTrap from 'focus-trap-react';
import { IconAdd } from 'assets/shared';

interface Props {
  feedbacksData: FeedbacksDataType;
  sortBy: SortByType;
  upvoted?: number[];
  onFeedbackUpvote: (id: number) => void;
  windowWidth: number;
}

export default function Home(props: Props) {
  const {
    feedbacksData,
    sortBy,
    upvoted = [],
    onFeedbackUpvote,
    windowWidth,
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsCategories = searchParams.get('categories');
  const categories = !searchParamsCategories
    ? 'All'
    : (searchParamsCategories.split(',') as CategoryType[]);

  const [isSidebarShown, setIsSidebarShown] = useState(false);

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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarShown(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 720) {
        setIsSidebarShown(false);
      }
    };

    if (isSidebarShown) {
      document.addEventListener('keydown', handleKeydown);
      window.addEventListener('resize', handleResize);
    } else {
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarShown]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categories]);

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
    <PageContainer className={styles.container}>
      <FocusTrap active={isSidebarShown}>
        <header className={styles.header} aria-label="header">
          <div className={styles['header__title']}>
            <ImageResponsive
              desktop={{ path: backgroundHeaderDesktop }}
              tablet={{ path: backgroundHeaderTablet, breakpoint: 975 }}
              mobile={{ path: backgroundHeaderMobile, breakpoint: 720 }}
              className={styles['header__title-img']}
            />
            <div className={styles['header__title-text']}>
              <Heading level="1" styleLevel="2">
                Frontend Mentor
              </Heading>
              <Text
                tag="span"
                variant="2"
                className={styles['header__title-text-subtitle']}
              >
                Feedback Board
              </Text>
            </div>

            {windowWidth <= 720 && (
              <button
                className={styles['header__hamburger']}
                onClick={() => setIsSidebarShown((state) => !state)}
                aria-label="toggle sidebar"
              >
                {isSidebarShown ? <IconClose /> : <IconHamburger />}
              </button>
            )}
          </div>

          <div
            className={`${styles['header__menu']} ${
              isSidebarShown ? styles.show : ''
            }`}
          >
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
                tabIndex={windowWidth <= 720 && !isSidebarShown ? -1 : undefined}
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
                  tabIndex={windowWidth <= 720 && !isSidebarShown ? -1 : undefined}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div
              className={`element-rounded ${styles.roadmap}`}
              aria-label="roadmap"
            >
              <div className={styles['roadmap__heading-wrapper']}>
                <Heading level="2" className={styles['roadmap__heading']}>
                  Roadmap
                </Heading>
                <Link
                  to="/roadmap"
                  className={`${styles['roadmap-anchor']} ${
                    roadmapDisabled ? styles['roadmap-anchor--disabled'] : ''
                  }`}
                  tabIndex={
                    (windowWidth <= 720 && !isSidebarShown) || roadmapDisabled
                      ? -1
                      : undefined
                  }
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
                  <Text
                    tag="span"
                    variant="1"
                    className={styles['roadmap__item-num']}
                  >
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
                  <Text
                    tag="span"
                    variant="1"
                    className={styles['roadmap__item-num']}
                  >
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
                  <Text
                    tag="span"
                    variant="1"
                    className={styles['roadmap__item-num']}
                  >
                    {feedbacksData.Live.length}
                  </Text>
                </li>
              </ul>
            </div>
          </div>
          {isSidebarShown && (
            <div
              className={styles['header__backdrop']}
              onClick={() => setIsSidebarShown(false)}
            />
          )}
        </header>
      </FocusTrap>
      <main className={styles.main} aria-label="main">
        <div className={styles.content}>
          <div className={styles['content__header']}>
            {windowWidth > 600 && (
              <div className={styles['content__header-suggestions']}>
                <IconSuggestions className={styles['content__header-icon']} />
                <Heading level="2" styleLevel="3">
                  {suggestionsRender.length} Suggestions
                </Heading>
              </div>
            )}
            {sortBy && (
              <Dropdown
                items={arrSortBy.map((sortBy) => ({
                  value: sortBy,
                }))}
                selected={sortBy}
                onSelect={(sortBy) => handleSortBy(sortBy as SortByType)}
                classNameWrapper={styles['content__header-dropdown']}
                classNameBtn={styles['content__header-dropdown-btn']}
                aria-label="sort by"
              >
                <Text
                  tag="span"
                  variant="2"
                  className={styles['content__header-dropdown-text']}
                >
                  Sort by : <span className="bold">{sortBy}</span>
                </Text>
              </Dropdown>
            )}
            <Link
              to="/new"
              className={`${buttonStyles.button} ${buttonStyles['button--1']} ${styles['content__header-add-feedback']}`}
              aria-label="add feedback"
            >
              {windowWidth > 360 ? '+ Add Feedback' : <IconAdd />}
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
                  There is no feedback yet
                  {categories !== 'All' &&
                    ` in ${categories.join(', ')} ${
                      categories.length === 1 ? 'category' : 'categories'
                    }`}
                  .
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
    </PageContainer>
  );
}
