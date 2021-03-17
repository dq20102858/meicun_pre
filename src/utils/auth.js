import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token-Mc'
const UserId = 'UserId'
const System = 'System'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(id) {
  return Cookies.set(UserId, id)
}
export function getUserId() {
  return Cookies.get(UserId)
}
export function removeUserId() {
  return Cookies.remove(UserId)
}
export function setSystem(system) {
  return Cookies.set(System, system)
}
export function getSystem() {
  return Cookies.get(System)
}
