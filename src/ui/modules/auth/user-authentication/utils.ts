export async function navigateToOAuthLoginPage() {
  const host = process.env.REACT_APP_API_HOST || window.location.host
  window.open(`${window.location.protocol}//${host}/oauth/login`, "_self")
}
