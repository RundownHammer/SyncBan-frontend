import React from 'react'
import Board from './Components/Board'

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white', padding: '16px' }}>Kanban Productivity</h1>
      <Board />
    </div>
  )
}

export default App
