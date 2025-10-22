import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  shouldMountOnce?: boolean; // if true = keep mounted after first visible

  margin?: number;
};

export default function LazyMount({
  children,
  shouldMountOnce = false,
  margin = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let frame: number;

    const check = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const winW = window.innerWidth;

      const isOnScreen = rect.right > 0 - margin && rect.left < winW + margin;

      if (shouldMountOnce) {
        // Case 1: mount once only
        if (!mounted && isOnScreen) {
          setMounted(true);
          return; // stop checking
        }
      } else {
        // Case 2: mount/unmount based on visibility continuously
        setMounted(isOnScreen);
      }

      frame = requestAnimationFrame(check);
    };

    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [margin, mounted, shouldMountOnce]);

  return <div ref={ref}>{mounted ? children : null}</div>;
}
