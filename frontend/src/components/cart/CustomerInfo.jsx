import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home } from 'lucide-react';
import PaymentInfo from './PaymentInfo';

const FormInput = ({ icon, placeholder, id, type = 'text' }) => (
    <div className="form-control">
        <label className="input input-bordered flex items-center gap-2">
            {icon}
            <input type={type} id={id} className="grow" placeholder={placeholder} />
        </label>
    </div>
);

const CustomerInfo = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="card bg-base-100 shadow-xl"
            variants={itemVariants}
        >
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Customer Information
                </h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput icon={<User size={16} />} placeholder="Full Name" id="fullName" />
                        <FormInput icon={<Mail size={16} />} placeholder="Email Address" id="email" type="email" />
                    </div>
                    <FormInput icon={<Phone size={16} />} placeholder="Phone Number" id="phone" type="tel" />
                    <div className="divider">Shipping Address</div>
                    <FormInput icon={<Home size={16} />} placeholder="Street Address" id="address" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput icon={<span className="text-xs"></span>} placeholder="City" id="city" />
                        <FormInput icon={<span className="text-xs"></span>} placeholder="State / Province" id="state" />
                        <FormInput icon={<span className="text-xs"></span>} placeholder="ZIP / Postal Code" id="zip" />
                    </div>
                </form>
            </div>

            {/* payment Information */}
            <PaymentInfo />

        </motion.div>
    );
};

export default CustomerInfo;