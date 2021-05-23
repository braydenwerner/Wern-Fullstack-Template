export const isEnumerableObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
