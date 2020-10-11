// parse the cookies into an object
function parseCookies(req) {
  const cookiesString = req.headers.cookie
  if (cookiesString) {
    const cookies = {}
    cookiesString.split(';').forEach(cookie => {
      const keyValue = cookie.trim().split('=')
      cookies[keyValue[0]] = keyValue[1]
    })
    return cookies
  } else {
    return null
  }
}

module.exports = parseCookies
