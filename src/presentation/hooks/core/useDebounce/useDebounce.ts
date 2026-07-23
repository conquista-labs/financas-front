import { useEffect, useState } from "react";

/**
 * Retorna o valor após `delay` ms sem alterações. Usado para busca com
 * debounce (evita disparar a query a cada tecla).
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
