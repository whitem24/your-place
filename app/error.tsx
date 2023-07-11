'use client';
import React, { useEffect } from 'react';
import EmptyState from './components/EmptyState';

interface ErrorStateProps {
    error : Error,
}

const ErrorState = ({error}:ErrorStateProps) => {
 useEffect(() => {
    console.error(error);
 }, [error]);

 return (
    <EmptyState 
        title='Oops'
        subtitle='Something went wrong!'
    />
 );
 
}

export default ErrorState