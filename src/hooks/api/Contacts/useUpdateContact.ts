import { updateContact } from "@src/api/ContactsAPI";
import ContactItem from "@src/models/ContactItem";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const editSound = new Audio(plingSound);

  const {
    mutate: updateContactMutation,
    isLoading,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (updatedContact: ContactItem) => updateContact(updatedContact),
    onSuccess: () => {
      editSound.play();
      setShowToast({
        open: true,
        message: "Contact updated successfully",
        extra: "",
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (err) => {
      setShowToast({
        open: true,
        message: "Failed to update contact",
        extra: "Please try again",
      });
      console.error("Error updating contact", err);
    },
  });

  return { updateContactMutation, isLoading, error, isSuccess };
};
