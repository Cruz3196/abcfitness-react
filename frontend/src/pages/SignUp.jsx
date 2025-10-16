import React from 'react';
import SignUpForm from '../components/user/SignUpForm';

const SignUp = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-6xl gap-6 sm:gap-8 lg:gap-12 px-4 py-8">
                <div className="text-center lg:text-left w-full lg:w-auto lg:pl-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">Join Us Today!</h1>
                    <p className="mt-4 text-base sm:text-lg lg:text-xl">
                        Create your account to start booking classes, purchasing products, and achieving your fitness goals.
                    </p>
                </div>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUp;