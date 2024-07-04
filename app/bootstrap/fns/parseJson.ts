export function parseJson<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('===> Error parseJson:', error)
    return fallback
  }
}

export function parseJsonByVal<T>(inputString: string, fallback?: T) {
  try {
    const jsonString = `{"data": ${inputString}}`
    // eslint-disable-next-line no-eval
    const jsonObject = eval(`(${jsonString})`)
    return jsonObject.data
  } catch (e) {
    console.error('===> Error parseJsonByVal:', e)
    return fallback
  }
}
