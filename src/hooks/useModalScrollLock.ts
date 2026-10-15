import { useEffect } from "react";
import { getLenisInstance } from "./useSmoothScroll";

let activeModalCount = 0;
let originalPaddingRight = "";
let originalOverflow = "";

export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Increment active modal count
    activeModalCount++;

    const lenis = getLenisInstance();
    if (lenis) {
      lenis.stop();
    }

    if (activeModalCount === 1) {
      // First modal opening - calculate scrollbar width to prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      originalPaddingRight = document.body.style.paddingRight || "";
      originalOverflow = document.body.style.overflow || "";

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      activeModalCount = Math.max(0, activeModalCount - 1);

      if (activeModalCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.documentElement.style.overflow = "";

        const currentLenis = getLenisInstance();
        if (currentLenis) {
          currentLenis.start();
        }
      }
    };
  }, [isOpen]);
}
