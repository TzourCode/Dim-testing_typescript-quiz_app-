import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('updates the player name when typed into the input', () => {
    render(<App />)
    const playerNameInput = screen.getByLabelText('Player name:')
    fireEvent.change(playerNameInput, { target: { value: 'Bob' } })
    expect(playerNameInput.value).toBe('Bob')
  })

  it('renders the player name input', () => {
    render(<App />)
    const playerNameInput = screen.getByLabelText('Player name:')
    expect(playerNameInput).toBeInTheDocument()
  })
})
