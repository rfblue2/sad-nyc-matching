const healthcheck = async () => {
  const res = await fetch('/healthcheck')
  return await res.text()
}

// Use to login after retrieving response from facebook
const fbLogin = async (fbAccessToken, fbUserId, email, name) => {
  const request = {
    fbAccessToken,
    fbUserId,
    email,
    name,
  }
  const loginRes = await fetch(`/api/users/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request)
  })

  if (loginRes.ok) {
    const jwtToken = loginRes.headers.get('x-auth-token')
    localStorage.setItem('jwtToken', jwtToken)
    return jwtToken
  }

  // TODO return an error?
  return null
}

// Use to login after retrieving auth token from local storage
const login = async (token) => {
  const res = await fetch(`/api/users/me`, {
    headers: {'Content-Type': 'application/json', 'x-auth-token': token},
  })

  if (res.status === 401) {
    // token probably expired
    localStorage.removeItem('jwtToken')
    return null
  }

  if (res.status !== 200) {
    // TODO return error?
    return null
  }

  return await res.json()
}

export default {
  healthcheck,
  login,
  fbLogin,
}