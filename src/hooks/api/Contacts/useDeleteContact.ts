import { deleteContact } from "@src/api/ContactsAPI";
import { useMutation, useQueryClient } from "react-query";

export const useDeleteContact = (contactId: string) => {
  const queryClient = useQueryClient();
  const {
    mutate: deleteContactMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: () => deleteContact(contactId),
    onSuccess: () => {
      console.log("Contact deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (err) => {
      console.log("Error deleting contact", err);
    },
  });

  return { deleteContactMutation, isLoading, isError, error };
};
