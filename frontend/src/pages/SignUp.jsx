import React from 'react';
import SignUpForm from '../components/user/SignUpForm';

const SignUp = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:pl-12">
                    <h1 className="text-5xl font-bold">Join Us Today!</h1>
                    <p className="py-6">Create your account to start booking classes, purchasing products, and achieving your fitness goals.</p>
                </div>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUp;
