export function ensureContext<T>(
  context: T,
): asserts context is NonNullable<T> {
  if (!context) {
    throw new Error('useContext must be used within Context.Provider')
  }
}
