export const determineLanguageFromUrl = url => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}
