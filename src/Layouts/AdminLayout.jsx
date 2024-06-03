import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <main className='App'>
              <Helmet>
                <title>LMS-ADMIN</title>
            </Helmet>
            <header>Admin Header</header>
            <Outlet />
            <footer>Admin Footer</footer>
        </main>
    )
}

export default AdminLayout