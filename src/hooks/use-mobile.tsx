import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(calculateIsMobile());

  React.useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(calculateIsMobile());
    };
    mql.addEventListener('change', onChange);
    setIsMobile(calculateIsMobile());
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

function calculateIsMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}
