export function sleep(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * @param {Date | string} date - The date to calculate the distance from. Can be a Date object or a date string.
 * @returns {string} - A string representing the time distance to now.
 */
export function getDistanceToNow(date: Date | string): string {
  try {
    const givenDate = new Date(date)
    const now = new Date()
    const milliseconds = now.getTime() - givenDate.getTime()
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) {
      return years === 1 ? '1 year ago' : `${years} years ago`
    }

    if (months > 0) {
      return months === 1 ? '1 month ago' : `${months} months ago`
    }

    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`
    }

    if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`
    }

    return !minutes || minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
  } catch (error) {
    console.error(error)
    return ''
  }
}

// Timer storage object to keep track of debounce timers
const timerDebounce: { [key: string]: NodeJS.Timeout | undefined } = {}

/**
 * Creates a debounced version of the provided function that delays its execution until after
 * the specified time has elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce.
 * @param time - The number of milliseconds to delay.
 * @returns A debounced version of the provided function.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  time: number
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    // Clear any existing timer for the given function
    clearTimeout(timerDebounce[func.name])

    // Define the delayed function
    const delayedFunction = () => {
      // Remove the timer entry after execution
      delete timerDebounce[func.name]
      // Invoke the original function with the provided arguments
      return func(...args)
    }

    // Set a new timer or execute immediately if time is 0
    if (time) {
      timerDebounce[func.name] = setTimeout(delayedFunction, time)
    } else {
      delayedFunction()
    }
  }
}
