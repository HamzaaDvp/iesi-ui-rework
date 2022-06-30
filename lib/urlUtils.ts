export function encodeQueryParams(data: Record<string, string | number | undefined>) {
  return Object
    .keys(data)
    .map((queryParam) => `${encodeURIComponent(queryParam)}=${encodeURIComponent(data[queryParam] || 'null')}`)
    .join('&');
}
