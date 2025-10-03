import React from 'react';

const DeleteClassModal = ({ isOpen, classTitle, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Delete Class</h3>
                <p className="mb-6">
                    Are you sure you want to delete "{classTitle}"? This action cannot be undone.
                </p>
                
                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-ghost">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-error" disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteClassModal;