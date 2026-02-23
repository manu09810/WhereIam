import { useEffect, useState } from "react";

export const useCurrency = (currency: string | null) => {
  const [boolean, setBoolean] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currency) {
      setBoolean(false);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        console.log("Requesting currency data for:", currency);
        const response = await fetch(
          `https://juanmalorenzo.com/api/${currency}`,
        );

        if (!response.ok) {
          setError("Error on the server side");
          setBoolean(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setBoolean(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching country:", error);
        setError("Error fetching country");
        setIsLoading(false);
      }
    })();
  }, [currency]);

  return { boolean, isLoading, error };
};
