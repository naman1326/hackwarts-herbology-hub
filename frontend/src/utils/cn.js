export function cn(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}
