'use client'; // We create this single component because we want to use the toaster as client, so we separate it from main component
import React from 'react'
import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster/>
  )
}

export default ToasterProvider