'use client';
import useRentModal from '@/app/hooks/useRentModal';
import React, { useState, useMemo } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import { categories } from '../nabvar/Categories';
import dynamic from "next/dynamic";
import Modal from './Modal';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors},
    setValue,
    watch,
    reset
  } = useForm<FieldValues>({
    defaultValues:{
        category:'',
        location:null,
        guestCount:1,
        roomCount:1,
        bathroomCount: 1,
        imageSrc: '',
        price: 1,
        title: '',
        description: ''
    }
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr:false,
  }), []);

  //Since react hook form setValue does not render the component we will make the following function instead of using it directly
  const setCustomValue = (id:string, value:any) => {
    setValue(id, value, {
        shouldDirty: true, // this will trigger validation and error messages to show up in the UI for,
        shouldValidate: true, 
        shouldTouch: true,
    });
  }

  const onBack = () => {
    setStep((value)=> value - 1);
  }

  const onNext = () => {
    setStep((value)=> value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data)=>{
    if (step !== STEPS.PRICE) {
        return onNext();
    }
    setIsLoading(true);
    axios.post('/api/listings', data)
        .then(()=>{
            toast.success('Listing created!');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        })
        .catch(()=>{
            toast.error('Something went wrong')
        })
        .finally(()=>{
            setIsLoading(false);
        })
  }

  const actionLabel = useMemo(() => {
    if(step===STEPS.PRICE){
        return 'Create';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if(step===STEPS.CATEGORY){
        return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
        <Heading 
            title='Which of these best describes your place'
            subtitle="We'll help you find the perfect match"
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
            {categories.map((item) => (
                <div className='col-span-1' key={item.label}>
                    {item.label}
                    <CategoryInput
                        onClick={(category)=>setCustomValue('category', category)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}
                    />
                </div>
            ))}
            
        </div>
    </div>
  )
  if (step === STEPS.LOCATION) {
    bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading 
                title={'Where is your place located'}
                subtitle={'Help guests find you!'}
            />
            <CountrySelect
                value={location}
                onChange={(value)=> setCustomValue('location', value)}
            />
            <Map
                center={location?.latlng}
            />
        </div>
    )
  }
  if (step === STEPS.INFO) {

    bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading 
                title='Share some basics about your place'
                subtitle='What amenities do you have?'
            />
            <Counter title={'Guests'} subtitle={'How many guests do you allow'} value={guestCount} onChange={(value)=>setCustomValue('guestCount', value)}/>
            <Counter title={'Rooms'} subtitle={'How many rooms do you have'} value={roomCount} onChange={(value)=>setCustomValue('roomCount', value)}/>
            <Counter title={'Bathrooms'} subtitle={'How many bathrooms do you have'} value={bathroomCount} onChange={(value)=>setCustomValue('bathroomCount', value)}/>

        </div>
    )

  }
  if (step === STEPS.IMAGES) {
    bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading 
                title='Add a photo of your place'
                subtitle="Let's get started, show guests how your place looks like!"
            />
            <ImageUpload value={imageSrc} onChange={(value) => setCustomValue('imageSrc', value)}/>

        </div>
    )
  }
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='How would you describe your place'
                subtitle='Write something short that describes what makes this unique and interesting.'   
            />
            <Input 
                id='title'
                label='Title'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <hr />
            <Input 
                id='description'
                label='Description'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )
    
  }
  if (step === STEPS.PRICE) {
    bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Now, set your price'
                subtitle="How much do you charge per night?"
            />
            <Input 
                id='price'
                label='Price'
                formatPrice
                type='number'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )
  }

  return (
    <Modal
     title={'Your Place your home'}
     body={bodyContent}
     isOpen={rentModal.isOpen}
     onClose={rentModal.onClose}
     onSubmit={handleSubmit(onSubmit)}
     actionLabel={actionLabel}
     secondaryActionLabel={secondaryActionLabel}
     secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  )
}

export default RentModal