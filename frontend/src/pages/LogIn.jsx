import React from 'react';
import LoginForm from '../components/user/LoginForm';

const Login = () => {
    return (
        <div className="flex-col sm:flex-col  sm:gap-3 lg:flex-row-reverse flex items-center justify-center min-h-screen w-full lg:gap-10 bg-base-200">
            <div className="text-center mb-8">
                <h1 className="text-5xl lg:text-6xl font-bold">ABC Fitness</h1>
                <p className="mt-3 text-lg lg:text-xl">Welcome back! Please sign in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
};

export default Login;