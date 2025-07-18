// src/app/contact/page.js
'use client'; 

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import parsePhoneNumberFromString from 'libphonenumber-js';

// Custom Icons (Ye waise hi rahenge)
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // === NAYA BADLAAV: Result state ab object hai jisme message aur status dono honge ===
  const [result, setResult] = useState({ status: 'idle', message: '' });

  const validateForm = (formData) => {
    const newErrors = {};
    let validPhone = null;

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    if (!name || name.trim() === "") newErrors.name = "Full Name is required.";
    
    if (!email) {
      newErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email Address is invalid.";
    }
    
    if (!phone) {
        newErrors.phone = "Phone Number is required.";
    } else {
        const parsedNumber = parsePhoneNumberFromString(phone, 'IN');
        if (parsedNumber && parsedNumber.isValid()) {
            validPhone = parsedNumber.number; 
        } else {
            newErrors.phone = "Please enter a valid Indian mobile or landline number.";
        }
    }

    if (!message || message.trim() === "") newErrors.message = "Message is required.";
    
    return { errors: newErrors, validPhone };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const { errors: validationErrors, validPhone } = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setResult({ status: 'loading', message: 'Sending...' });
    
    const dataObject = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: validPhone, 
        message: formData.get('message'),
    };

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
        });

        if (response.ok) {
            setResult({ status: 'success', message: 'Message Sent Successfully! We will get back to you soon.' });
            event.target.reset();
            setTimeout(() => setResult({ status: 'idle', message: '' }), 4000);
        } else {
            throw new Error('Server responded with an error');
        }
    } catch (error) {
        setResult({ status: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // Helper function to get message color based on status
  const getResultColor = (status) => {
      switch(status) {
          case 'success': return 'text-green-600';
          case 'error': return 'text-red-600';
          default: return 'text-gray-600';
      }
  }

  return (
    <div className="bg-white">
      <motion.div 
        className="bg-slate-800 py-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 className="text-5xl font-bold text-white tracking-tight" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Get In Touch
        </motion.h1>
        <motion.p className="text-xl text-slate-300 mt-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            Your vision, our expertise. Let's start the conversation.
        </motion.p>
      </motion.div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <motion.div 
            className="lg:col-span-3"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl font-semibold mb-8 border-l-4 border-slate-800 pl-4">Send a Message</h2>
            
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              
              {/* === Input Fields (Koi badlaav nahi) === */}
              <div>
                <div className="relative">
                  <input type="text" name="name" id="name" required className="peer block w-full px-1 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-slate-800" placeholder=" " />
                  <label htmlFor="name" className="absolute left-1 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">Full Name</label>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="relative">
                  <input type="email" name="email" id="email" required className="peer block w-full px-1 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-slate-800" placeholder=" " />
                  <label htmlFor="email" className="absolute left-1 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">Email Address</label>
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <input type="tel" name="phone" id="phone" required className="peer block w-full px-1 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-slate-800" placeholder=" " />
                  <label htmlFor="phone" className="absolute left-1 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">Phone Number</label>
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                 <div className="relative">
                  <textarea name="message" id="message" rows="5" required className="peer block w-full px-1 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-slate-800" placeholder=" "></textarea>
                  <label htmlFor="message" className="absolute left-1 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">Tell us about your project...</label>
                </div>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* === NAYA BADLAAV: Button aur Result Message === */}
              <div className="!mt-10">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-700 hover:shadow-lg transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Your Message'}
                </button>
                {result.message && (
                    <p className={`text-center mt-4 text-sm font-medium ${getResultColor(result.status)}`}>
                        {result.message}
                    </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* === Contact Information Section (Koi badlaav nahi) === */}
          <motion.div 
            className="lg:col-span-2 space-y-12"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div>
              <h2 className="text-3xl font-semibold mb-6 border-l-4 border-slate-800 pl-4">Contact Information</h2>
              <div className="space-y-4 text-lg">
                <div className="flex items-center text-gray-600"><PhoneIcon/><a href="tel:+910000000000" className="hover:text-slate-800">+91 000-000-0000</a></div>
                <div className="flex items-center text-gray-600"><MailIcon/><a href="mailto:contact@jvf.com" className="hover:text-slate-800">contact@jvf.com</a></div>
                <div className="flex items-start text-gray-600"><LocationIcon/><p>JVF Industries, Bikaner Industrial Area,<br/>Bikaner, Rajasthan, 334001</p></div>
              </div>
            </div>
            <div className="h-80 w-full rounded-lg overflow-hidden border-2 border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112673.2307844033!2d73.2384197972656!3d28.022934600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393fdd315367f08b%3A0xda745f47a59a930!2sBikaner%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1718362483569!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;