'use client';
import React, {useCallback, useState} from 'react';
import {AiFillGithub} from 'react-icons/ai';
import {FcGoogle} from 'react-icons/fc';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import useLoginModal from '@/app/hooks/useLoginModal';
import { signIn } from "next-auth/react";
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import { useRouter } from "next/navigation";
import { ToggleAuth } from '@/app/utils/ToggleModal';


const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues:{
      email: '',
      password: ''
    }
  });

  // submit handler
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    setIsLoading(true);
    signIn('credentials', {
      ...data,
      redirect:false,
    })
    .then((callback) => {
      /* console.log(callback); */
      setIsLoading(false);
      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh(); 
        loginModal.onClose();
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    })

  }
  
  const toggle = ToggleAuth('login');

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading 
        title={"Welcome back"}
        subtitle={"Login to your account!"}/>
      <Input 
        id="email"
        label="Email"
        disabled = {isLoading}
        register = {register} 
        errors={errors}
        required 
      />
      <Input 
        id="password"
        label="Password"
        disabled = {isLoading}
        register = {register} 
        errors={errors}
        required 
      />
    </div>
  );

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr />
      <Button 
        outline
        label={"Continue with google"}
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />
      <Button 
        outline
        label={"Continue with Github"}
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div className='text-neutral-500 text-center mt-4 font-light'>
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            First time using Your Place?
          </div>
          <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
            Create an account
          </div>
        </div>
      </div>

    </div>
  )

  return (
    <Modal 
      disabled={isLoading} 
      isOpen={loginModal.isOpen} 
      title={"Login"} 
      actionLabel={"Continue"} 
      onClose={loginModal.onClose} 
      onSubmit={handleSubmit(onSubmit)}
      body = {bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal