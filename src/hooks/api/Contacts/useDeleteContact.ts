import { deleteContact } from "@src/api/ContactsAPI";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

export const useDeleteContact = (contactId: string) => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);

  const {
    mutate: deleteContactMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteContact(contactId),
    onSuccess: () => {
      setShowToast({
        open: true,
        message: "Contact deleted successfully",
        extra: "",
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      setShowToast({
        open: true,
        message: "Error deleting contact",
        extra: "",
      });
    },
  });

  return { deleteContactMutation, isLoading, isError, error };
};
