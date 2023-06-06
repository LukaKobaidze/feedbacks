import { useState, useEffect } from 'react';
import { CategoryType } from 'types';
import styles from 'styles/FeedbackNew.module.scss';
import { Button, Dropdown, GoBack, Heading } from 'components';
import { IconNewFeedback } from 'assets/shared';
import Field from 'components/Field';
import { categories } from 'data';
import { useNavigate } from 'react-router-dom';

type InputType = { value: string; error: string };

interface Props {
  onFeedbackAdd: (
    title: string,
    category: CategoryType,
    description: string
  ) => void;
}

export default function FeedbackNew(props: Props) {
  const { onFeedbackAdd } = props;

  const navigate = useNavigate();
  const [title, setTitle] = useState<InputType>({ value: '', error: '' });
  const [category, setCategory] = useState<CategoryType>('Feature');
  const [description, setDescription] = useState<InputType>({
    value: '',
    error: '',
  });

  useEffect(() => {
    document.title = 'Create New Feedback | Product Feedback';
  }, []);

  const isValid = (): boolean => {
    const inputs: [InputType, React.Dispatch<React.SetStateAction<InputType>>][] = [
      [title, setTitle],
      [description, setDescription],
    ];

    let output = true;

    inputs.forEach(([input, setInput]) => {
      if (input.value.trim().length === 0) {
        output = false;
        setInput((state) => ({ value: state.value, error: "Can't be empty" }));
      }
    });

    return output;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid()) {
      onFeedbackAdd(title.value, category, description.value);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <GoBack to="/" />
      </header>
      <main className={`element-rounded ${styles.main}`}>
        <IconNewFeedback className={`${styles.icon} ${styles['icon-new']}`} />
        <Heading level="1" className={styles.heading}>
          Create New Feedback
        </Heading>

        <form onSubmit={handleSubmit}>
          <Heading level="2" styleLevel="4" className={styles['field-title']}>
            Feedback Title
          </Heading>
          <label htmlFor="title" className={styles['field-label']}>
            Add a short, descriptive headline
          </label>
          <Field
            type="text"
            id="title"
            value={title.value}
            error={title.error}
            onChange={(e) => setTitle({ value: e.target.value, error: '' })}
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
            selected={category}
            onSelect={(category) => setCategory(category as CategoryType)}
            id="category"
            classNameWrapper={styles.field}
          >
            {category}
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
            value={description.value}
            error={description.error}
            onChange={(e) => setDescription({ value: e.target.value, error: '' })}
          />

          <div className={`${styles.buttons} ${styles['feedbacknew-buttons']}`}>
            <Button
              variant="3"
              onClick={() => navigate('/')}
              className={styles['btn-cancel']}
            >
              Cancel
            </Button>
            <Button variant="1" type="submit">
              Add Feedback
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
