import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryType, FeedbackType, FeedbacksDataType } from 'types';
import { IconEditFeedback } from 'assets/shared';
import { categories } from 'data';
import { Button, Dropdown, Feedback, GoBack, Heading } from 'components';
import Field from 'components/Field';
import ModalDelete from 'components/ModalDelete';
import styles from 'styles/FeedbackEdit.module.scss';

interface Props {
  data: FeedbacksDataType;
  upvoted: number[];
  onDelete: (id: number) => void;
  onSaveChanges: (
    edited: Omit<FeedbackType, 'comments' | 'upvotes'>,
    newStatus?: keyof FeedbacksDataType
  ) => void;
}

export default function FeedbackEdit(props: Props) {
  const { data, upvoted, onDelete, onSaveChanges } = props;

  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const feedbackData = useMemo(():
    | (FeedbackType & {
        status: keyof FeedbacksDataType;
      })
    | null => {
    const keys = Object.keys(data) as (keyof FeedbacksDataType)[];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const found = data[key].find((feedback) => feedback.id === Number(feedbackId));

      if (found) {
        return { ...found, status: key };
      }
    }

    return null;
  }, [feedbackId, data]);

  const [titleEdited, setTitleEdited] = useState(feedbackData?.title || '');
  const [categoryEdited, setCategoryEdited] = useState<CategoryType>(
    feedbackData?.category || 'UI'
  );
  const [statusEdited, setStatusEdited] = useState(
    feedbackData?.status || 'Suggestion'
  );
  const [descriptionEdited, setDescriptionEdited] = useState(
    feedbackData?.description || ''
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!feedbackData) return;

    e.preventDefault();

    onSaveChanges(
      {
        id: feedbackData.id,
        title: titleEdited,
        category: categoryEdited,
        description: descriptionEdited,
      },
      feedbackData.status !== statusEdited ? statusEdited : undefined
    );

    navigate('/' + feedbackId);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <GoBack variant="1" to={'/' + feedbackId} />
      </header>
      <main className={`element-rounded ${styles.main}`}>
        <IconEditFeedback className={styles.icon} />

        {feedbackData && (
          <form onSubmit={handleSubmit}>
            <Heading level="1" className={styles.heading}>
              Editing '{feedbackData.title}'
            </Heading>

            <Heading level="2" styleLevel="4" className={styles['field-title']}>
              Feedback Title
            </Heading>
            <label htmlFor="title" className={styles['field-label']}>
              Add a short, descriptive headline
            </label>
            <Field
              type="text"
              id="title"
              value={titleEdited}
              onChange={(e) => setTitleEdited(e.target.value)}
              className={styles.field}
              autoFocus
            />

            <Heading level="2" styleLevel="4" className={styles['field-title']}>
              Category
            </Heading>
            <label htmlFor="category" className={styles['field-label']}>
              Choose a category for your feedback
            </label>
            <Dropdown
              variant="2"
              items={categories.map((category) => ({ value: category }))}
              selected={categoryEdited}
              onSelect={(category) => setCategoryEdited(category as CategoryType)}
              id="category"
              classNameWrapper={styles.field}
            >
              {categoryEdited}
            </Dropdown>

            <Heading level="2" styleLevel="4" className={styles['field-title']}>
              Update Status
            </Heading>
            <label htmlFor="status" className={styles['field-label']}>
              Change feedback state
            </label>
            <Dropdown
              variant="2"
              id="status"
              items={Object.keys(data).map((status) => ({ value: status }))}
              onSelect={(status) =>
                setStatusEdited(status as keyof FeedbacksDataType)
              }
              selected={statusEdited}
              classNameWrapper={styles.field}
            >
              {statusEdited}
            </Dropdown>

            <Heading level="2" styleLevel="4" className={styles['field-title']}>
              Feedback Detail
            </Heading>
            <label htmlFor="description" className={styles['field-label']}>
              Include any specific comments on what should be improved, added, etc.
            </label>
            <Field
              type="textarea"
              id="description"
              className={`${styles.field} ${styles['description-textarea']}`}
              value={descriptionEdited}
              onChange={(e) => setDescriptionEdited(e.target.value)}
            />

            <div className={styles.buttons}>
              <Button
                variant="4"
                onClick={() => setIsDeleting(true)}
                type="button"
                className={styles['btn-delete']}
              >
                Delete
              </Button>
              <Button
                variant="3"
                onClick={() => navigate('/' + feedbackId)}
                className={styles['btn-cancel']}
              >
                Cancel
              </Button>
              <Button variant="1" type="submit">
                Save Changes
              </Button>
            </div>

            {isDeleting && (
              <ModalDelete
                heading="Delete Feedback"
                paragraph="Are you sure you want to delete this feedback?"
                elementDeleting={
                  <Feedback
                    isUpvoted={upvoted.includes(feedbackData.id)}
                    {...feedbackData}
                  />
                }
                onCloseModal={() => setIsDeleting(false)}
                onDelete={() => {
                  onDelete(Number(feedbackId));
                  navigate('/');
                }}
              />
            )}
          </form>
        )}
      </main>
    </div>
  );
}
