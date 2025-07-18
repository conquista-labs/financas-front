import { useEffect, useState } from "react";

export const useIsMobile = (breakpoint = 768): { isMobile: boolean } => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return { isMobile };
};

export default useIsMobile;
