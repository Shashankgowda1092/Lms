import React, { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
import axios from '../../Api/axios';
 
const Userdailoge = ({ setIsUserDailogeOpen }) => {
    const { auth } = useAuth();
 
    function handleUserDailoge() {
        setIsUserDailogeOpen(false);
    }
 

 
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Batches  {auth.username}</h2>
                <p className="mb-4">This is the dialog content for managing batches.</p>
                <button onClick={handleUserDailoge} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
            </div>
        </div>
    );
};
 
export default Userdailoge;