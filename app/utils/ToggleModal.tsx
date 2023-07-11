import { useCallback } from "react";
import useLoginModal from "../hooks/useLoginModal";
import useRegisterModal from "../hooks/useRegisterModal";

export const ToggleAuth = (isModal:string) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    
    return useCallback(
        () => {
         if (isModal==='register') {
            loginModal.onOpen();
            registerModal.onClose();
         }else{
            registerModal.onOpen();
            loginModal.onClose();
         }
         
        },
        [loginModal, registerModal, isModal],);
}