import React, { useState } from 'react';
import { userStore } from '../../storeData/userStore';

const DeleteAccount = ({ onCancel, onSuccess }) => {
  const { deleteAccount, isDeletingAccount } = userStore();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const handleDeleteClick = () => {
    if (confirmText.toLowerCase() !== 'delete my account') {
      setError('Please type "delete my account" to confirm');
      return;
    }
    setShowFinalConfirmation(true);
  };

  const handleFinalDelete = async () => {
    const result = await deleteAccount();
    
    if (result.success) {
      onSuccess?.(result.message);
    } else {
      setError(result.message || 'Failed to delete account');
      setShowFinalConfirmation(false);
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    setError('');
    setShowFinalConfirmation(false);
    onCancel();
  };

  if (showFinalConfirmation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Final Confirmation</h2>
          <p className="text-gray-600 mb-6">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowFinalConfirmation(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              No, Keep My Account
            </button>
            <button
              onClick={handleFinalDelete}
              disabled={isDeletingAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeletingAccount ? 'Deleting...' : 'Yes, Delete Forever'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-6">
          This action will permanently delete your account and all associated data. This cannot be undone.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">This will delete:</h3>
          <ul className="text-sm text-red-700 text-left list-disc list-inside space-y-1">
            <li>Your profile information</li>
            <li>All your class bookings</li>
            <li>Your reviews and feedback</li>
            <li>Account access and login credentials</li>
          </ul>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
            To confirm, type "delete my account" below:
          </label>
          <input
            type="text"
            id="confirmText"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="delete my account"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;