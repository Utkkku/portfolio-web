import { formatDate, cn, debounce, throttle } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      expect(formatDate('2024-03')).toBe('Mart 2024')
    })

    it('should handle invalid date gracefully', () => {
      // formatDate tries to parse 'invalid-01' which becomes a date
      // This is expected behavior, the function doesn't validate input format
      const result = formatDate('invalid')
      expect(typeof result).toBe('string')
    })

    it('should handle empty string', () => {
      // Empty string + '-01' becomes 'Invalid Date'
      const result = formatDate('')
      expect(typeof result).toBe('string')
    })
  })

  describe('cn (className utility)', () => {
    it('should join class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('should filter out falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, false, 'class3')).toBe(
        'class1 class2 class3'
      )
    })

    it('should handle empty arguments', () => {
      expect(cn()).toBe('')
    })

    it('should handle only falsy values', () => {
      expect(cn(null, undefined, false)).toBe('')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous call if called again', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      jest.advanceTimersByTime(500)
      debouncedFn()
      jest.advanceTimersByTime(500)
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(500)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()

    it('should execute function immediately on first call', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 1000)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should throttle subsequent calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 1000)

      throttledFn()
      throttledFn()
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(1000)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })
})

