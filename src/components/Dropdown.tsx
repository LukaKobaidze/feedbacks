import { useEffect, useRef, useState, useCallback } from 'react';
import { IconArrowDown, IconArrowUp, IconCheck } from 'assets/shared';
import { AlertOutsideClick } from 'components';
import styles from 'styles/Dropdown.module.scss';

type Props = {
  variant?: '1' | '2';
  items: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>[];
  selected?: string;
  onSelect: (value: string) => void;
  classNameWrapper?: string;
  classNameBtn?: string;
} & (
  | { show?: undefined }
  | { show: boolean; setShow: React.Dispatch<React.SetStateAction<boolean>> }
) &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

let latestWindowHeight = 0;
let latestWindowWidth = 0;

export default function Dropdown(props: Props) {
  const {
    variant = '1',
    items,
    selected,
    onSelect,
    show,
    className,
    classNameWrapper,
    classNameBtn,
    children,
    onClick,
    ...restProps
  } = props;
  const [itemFocused, setItemFocused] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [dropdownOffsetX, setDropdownOffsetX] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const updateShowState = useCallback(
    (val: React.SetStateAction<boolean>) => {
      if (show !== undefined) {
        props.setShow(val);
      } else {
        setShowDropdown(val);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show]
  );

  const updateDropdown = () => {
    const dropdownContainer = dropdownRef.current;
    if (!dropdownContainer) return;
    const dropdownContainerRect = dropdownContainer.getBoundingClientRect();

    // Dropdown Offset X
    const windowWidth = window.innerWidth;
    setDropdownOffsetX((state) => {
      // Check Overflow RIGHT side
      if (windowWidth !== latestWindowWidth) {
        latestWindowWidth = windowWidth;

        const overflowOffsetRight =
          dropdownContainerRect.right - state - windowWidth + 10;

        if (overflowOffsetRight > 0) {
          return overflowOffsetRight * -1;
        } else {
          // Check Overflow LEFT side
          const overflowOffsetLeft = (dropdownContainerRect.left + state) * -1;

          if (overflowOffsetLeft > 0) {
            return overflowOffsetLeft;
          }
        }
        return 0;
      }
      return state;
    });

    // Dropdown Direction

    if (!mainButtonRef.current) return;

    const windowHeight = window.innerHeight;
    if (windowHeight !== latestWindowHeight) {
      latestWindowHeight = windowHeight;

      const dropdownBottomPos =
        mainButtonRef.current.getBoundingClientRect().bottom +
        (dropdownContainer.clientHeight || 0) +
        20;

      setDropdownDirection(dropdownBottomPos >= windowHeight ? 'up' : 'down');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        mainButtonRef.current?.focus();
        updateShowState(false);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setItemFocused((state) => {
          if (state === null || state === items.length - 1) {
            return 0;
          }
          return state + 1;
        });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setItemFocused((state) => {
          if (state === null || state === 0) {
            return items.length - 1;
          }
          return state - 1;
        });
      }
    };

    updateDropdown();
    if (show || showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', updateDropdown);
    } else {
      setItemFocused(null);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateDropdown);
      latestWindowHeight = 0;
      latestWindowWidth = 0;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateDropdown);
    };
  }, [items.length, show, showDropdown, updateShowState]);

  const dropdownStyle = {
    '--offsetX': dropdownOffsetX + 'px',
  } as React.CSSProperties;

  return (
    <AlertOutsideClick
      event="click"
      className={`${styles.container} ${
        !show && !showDropdown ? styles.hide : ''
      } ${classNameWrapper}`}
      onOutsideClick={() => updateShowState(false)}
      handleWhen={show || showDropdown}
    >
      <button
        ref={mainButtonRef}
        className={`${styles['main-button']} ${styles[`main-button--${variant}`]} ${classNameBtn}`}
        onClick={(e) => {
          updateShowState((state) => !state);
          onClick && onClick(e);
        }}
        type="button"
        {...restProps}
      >
        {children}
        <IconArrowUp className={styles['main-button__icon']} />
      </button>

      {(show || showDropdown) && (
        <div
          ref={dropdownRef}
          className={`${styles.dropdown} ${
            dropdownDirection === 'up' ? styles.up : ''
          } ${className}`}
          style={dropdownStyle}
          aria-label="dropdown"
        >
          {items.map(({ className, onClick, value, ...restProps }, i) => (
            <div key={String(value)} className={styles['dropdown__item']}>
              <input
                ref={itemFocused === i ? (node) => node?.focus() : undefined}
                type="button"
                className={`${styles['dropdown__item-btn']} ${className}`}
                onClick={(e) => {
                  onSelect(String(value));
                  updateShowState(false);
                  mainButtonRef.current?.focus();
                  onClick && onClick(e);
                }}
                onFocus={() => setItemFocused(i)}
                value={value}
                disabled={!show && !showDropdown}
                {...restProps}
              />
              {value === selected && (
                <IconCheck className={styles['dropdown__item-icon']} />
              )}
            </div>
          ))}
        </div>
      )}
    </AlertOutsideClick>
  );
}
