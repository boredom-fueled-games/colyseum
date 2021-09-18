import { useEffect, useRef, useState } from 'react';

type AlwaysScrollToBottomProps = {
  disabled?: boolean
  once?: boolean
}

const AlwaysScrollToBottom = ({disabled = false, once = false}: AlwaysScrollToBottomProps): JSX.Element => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hasRun || disabled || !elementRef || !elementRef.current) {
      return;
    }

    elementRef.current.scrollIntoView();
  });
  if (!disabled && once && !hasRun && elementRef.current) {
    elementRef.current.scrollIntoView();
    setHasRun(true);
  }
  return <div ref={elementRef}/>;
};

export default AlwaysScrollToBottom;
