const healthcheck = async () => {
  const res = await fetch('/healthcheck')
  return await res.text()
}

export default {
  healthcheck
}