import React, { useState, useEffect } from 'react'
import FacebookLogin from 'react-facebook-login'
import Api from './api/Api'

const App = () => {
  const [health, setHealth] = useState('waiting for healthcheck...')
  const [user, setUser] = useState({})

  useEffect(() => {
    const get = async () => setHealth(await Api.healthcheck())
    get()
  }, [])

  const login = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) setUser(null)
    else setUser(await Api.login(token))
  }

  useEffect(() => {
    login()
  }, [])

  const responseFacebook = async (res) => {
    await Api.fbLogin(res.accessToken, res.id, res.email, res.name)
    login()
  }

  return (
    <div className="App">
      This app is a work in progress.  Come back later!
      <br />
      Healthcheck: {health}
      <br />
      { !user && 
        <FacebookLogin
          appId='269610851097558'
          autoLoad={true}
          fields='name,picture'
          scope={'email'}
          callback={responseFacebook}
        />
      }
      { user && `Welcome ${user.name}`}
    </div>
  )
}

export default App;
