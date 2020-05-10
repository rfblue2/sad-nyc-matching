import React, { useState, useEffect } from 'react';
import Api from './api/Api';

const App = () => {
  const [health, setHealth] = useState('waiting for healthcheck...')

  useEffect(() => {
    const get = async () => setHealth(await Api.healthcheck())
    get()
  }, [])

  return (
    <div className="App">
      This app is a work in progress.  Come back later!
      <br />
      Healthcheck: {health}
    </div>
  )
}

export default App;
