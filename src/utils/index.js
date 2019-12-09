export const determineLanguageFromUrl = url => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}

export const getAgeGroupTitleWithoutAges = title =>
  title.split('(')[0].split(':')[0]
