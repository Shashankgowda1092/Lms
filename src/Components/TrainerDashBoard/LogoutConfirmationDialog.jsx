import React from 'react';
 
const LogoutConfirmationDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-semibold mb-4">Are you sure to logout?</p>
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 mr-2 bg-blue-800 text-white rounded hover:bg-blue-300 focus:outline-none focus:bg-blue-300"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-300 focus:outline-none focus:bg-blue-300"
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