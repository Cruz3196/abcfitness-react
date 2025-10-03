import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { User } from 'lucide-react';


const PaymentInfo = () => { 
    
    return (
        <div className="card-body">
            <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                Payment Information
            </h2>
            <form className="space-y-4">
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <CreditCard size={16} />
                        <input type="text" className="grow" placeholder="Card Number" />
                    </label>
                </div>
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <User size={16} />
                        <input type="text" className="grow" placeholder="Cardholder Name" />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="input input-bordered flex items-center gap-2">
                            <Calendar size={16} />
                            <input type="text" className="grow" placeholder="MM / YY" />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="input input-bordered flex items-center gap-2">
                            <Lock size={16} />
                            <input type="text" className="grow" placeholder="CVV" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PaymentInfo;