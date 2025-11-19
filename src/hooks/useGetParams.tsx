import { useRouter } from "@tanstack/react-router";

export const useGetParams = () => {
  const { state } = useRouter();

  const getParams = () => {
    const { matches } = state;
    const lastMatch = matches.at(-1);
    const { params = {} } = lastMatch ?? {};
    return params;
  };

  return { getParams };
};
