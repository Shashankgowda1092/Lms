import {render,screen} from '@testing-library/react'
import App from './App'
import { expect } from 'vitest'

// import matchers from '@testing-library/jest-dom'
// expect.extend(matchers)

it("should have a butt",()=>{
    render(
    <App/>
)
    const message = screen.queryByText(/hello world/i)
    expect(message).toBeVisible();
});