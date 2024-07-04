export const scrollToTopPage = (): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

export function getObjectByKeyPath(obj: any, keyPath: string) {
  let value = obj
  const keys = keyPath.split('.')

  for (let i = 0; i < keys.length; i++) {
    if (!value[keys[i]]) {
      return undefined
    }

    value = value[keys[i]]
  }

  return value
}

export function capitalizeFirstLetter(string: string) {
  return string && string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
}
