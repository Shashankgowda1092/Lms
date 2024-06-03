import React from 'react';

import useAuth from '../Hooks/useAuth';

function MyProfile() {
  const {auth} = useAuth()
  return (
<div className="flex flex-col justify-center items-center w-full min-h-screen">
 {auth}
</div>

  )
}

export default MyProfile
