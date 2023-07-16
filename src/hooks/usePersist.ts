import { useState, useEffect } from "react";

const usePersist = () => {
  const persistJson = localStorage.getItem("persist");
  const [persist, setPersist] = useState(
    persistJson !== null ? JSON.parse(persistJson) : false
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;
