import React from 'react';

const LogoutConfirmationDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-semibold mb-4">Are you sure you want to logout?</p>
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 mr-2 bg-black text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-400 text-gray-800 rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationDialog;
