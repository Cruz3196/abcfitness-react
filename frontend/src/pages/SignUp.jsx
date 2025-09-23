import React from 'react';
import SignUpForm from '../components/user/SignUpForm';

const SignUp = () => {
    return (
        <div className="sm:flex-col sm:gap-3 lg:flex-row-reverse flex items-center justify-center min-h-screen w-full lg:gap-10 bg-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">ABC Fitness</h1>
                <p className="text-gray-600 mt-3 text-lg lg:text-xl">Join us today! Create your account to get started</p>
            </div>
            <SignUpForm />
        </div>
    );
};

export default SignUp;