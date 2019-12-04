export const determineLanguageFromUrl = () => {
  const url = new URL(window.location)
  return url.searchParams.get('lang') || 'fi'
}
