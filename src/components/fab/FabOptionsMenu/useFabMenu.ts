import { useNavigate, useSearch } from "@tanstack/react-router";

export function useFabMenu() {
  const navigate = useNavigate();
  const { addOptions } = useSearch({ strict: false });

  const openMenu = () => {
    navigate({
      to: ".",
      search: { addOptions: true },
      state: (s) => ({ ...s }),
    });
  };

  return {
    open: Boolean(addOptions),
    openMenu,
  };
}
