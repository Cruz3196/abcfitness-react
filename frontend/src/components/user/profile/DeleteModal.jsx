import React from "react";

const DeleteModal = React.memo(({ onCancel, onConfirm }) => (
  <div className="modal modal-open">
    <div className="modal-backdrop bg-black/50" onClick={onCancel}></div>
    <div className="modal-box max-w-sm">
      <h3 className="font-bold text-lg">Close your account?</h3>
      <p className="py-4 text-sm text-base-content/70">
        This will permanently delete your account, order history, and class
        bookings. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button className="btn btn-sm flex-1" onClick={onCancel}>
          No, keep account
        </button>
        <button className="btn btn-error btn-sm flex-1" onClick={onConfirm}>
          Yes, close account
        </button>
      </div>
    </div>
  </div>
));

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
