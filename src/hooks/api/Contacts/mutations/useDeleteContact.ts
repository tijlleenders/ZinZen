import { deleteContact } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { displayToast } from "@src/store";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";

export const useDeleteContact = (contactId: string) => {
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
    },
    mutationKey: CONTACT_QUERY_KEYS.all,
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
