import React from 'react'
import { Outlet } from 'react-router-dom'

const TraineeLayout = () => {
    return (
        <main className='App'>
              <Helmet>
                <title>LMS-TRAINEE</title>
            </Helmet>
            <header>Trainee Header</header>
            <Outlet />
            <footer>Trainee Footer</footer>
        </main>
    )
}

export default TraineeLayout