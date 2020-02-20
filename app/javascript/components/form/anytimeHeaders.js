export const anytimeHeaders = {
  Authorization: `Bearer ${process.env.ANYTIME_API_KEY}`,
  Accept:
    process.env.NODE_ENV === 'development'
      ? 'application/json;version=1.1;sandbox'
      : 'application/json;version=1.1',
  'Content-Type': 'application/json'
}
