import React from 'react';
import LoginForm from '../components/user/LoginForm';

const Login = () => {
    return (
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center min-h-screen w-full gap-6 sm:gap-8 lg:gap-10 bg-base-200 px-4 py-8">
            <div className="text-center w-full max-w-md">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">ABC Fitness</h1>
                <p className="mt-3 text-base sm:text-lg lg:text-xl">Welcome back! Please sign in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
};

export default Login;