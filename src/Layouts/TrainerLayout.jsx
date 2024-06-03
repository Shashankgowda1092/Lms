import React from 'react'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'

const TrainerLayout = () => {
    return (
        <main className='App'>
            <Helmet>
                <title>LMS-TRANIER</title>
            </Helmet>
            <header>Trainer Header</header>
            <Outlet />
            <footer>Trainer Footer</footer>
        </main>
    )
}

export default TrainerLayout