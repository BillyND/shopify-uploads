export function cloneDeep<T>(value: T): T {
  // Check for null or undefined
  if (value === null || value === undefined) {
    return value
  }

  // Handle primitive types and functions
  if (typeof value !== 'object') {
    return value
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as any
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => cloneDeep(item)) as any
  }

  // Handle Map
  if (value instanceof Map) {
    const result = new Map()

    value.forEach((val, key) => {
      result.set(key, cloneDeep(val))
    })

    return result as any
  }

  // Handle Set
  if (value instanceof Set) {
    const result = new Set()
    value.forEach(val => {
      result.add(cloneDeep(val))
    })
    return result as any
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as any
  }

  // Handle Symbols
  if (typeof value === 'symbol') {
    return Symbol((value as any).description) as any
  }

  // Handle Object
  if (value instanceof Object) {
    const result: { [key: string]: any } = {}

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = cloneDeep(value[key])
      }
    }
    return result as T
  }

  // If we reached here, throw an error for unsupported types
  throw new Error(`Unsupported type: ${typeof value}`)
}
