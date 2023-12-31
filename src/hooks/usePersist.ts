import { useState, useEffect } from "react";

const usePersist = () => {
  const persistJson = localStorage.getItem("persist");
  const [persist, setPersist] = useState<boolean>(
    persistJson !== null ? JSON.parse(persistJson) : false
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist] as const;
};
export default usePersist;
