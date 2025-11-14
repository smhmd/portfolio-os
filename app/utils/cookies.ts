export function setCookie(name: string, value: string, days = 365) {
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${new Date(Date.now() + days * 864e5).toUTCString()}; path=/`
}

export function getCookie(
  name: string,
  cookie = document.cookie,
): string | undefined {
  const match = cookie.split('; ').find((row) => row.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

export function deleteCookie(name: string) {
  setCookie(name, '', -1)
}
