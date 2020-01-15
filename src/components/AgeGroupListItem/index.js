import React from 'react'
import ListItem from 'components/ListItem'
import ageGroupGraphics from 'graphics/ageGroups'

const AgeGroupItem = ({ ageGroup, language }) => {
  const languageInfo = ageGroup.item.languages.find(x => x.lang === language)

  return (
    <ListItem
      guid={ageGroup.guid}
      ageGroupGuid={ageGroup.ageGroupGuid}
      title={languageInfo ? languageInfo.title : ageGroup.title}
      subTitle={'Ikäryhmä plakkarissa'}
      language={language}
      icon={ageGroupGraphics[`AgeGroup${ageGroup.guid}`] || null}
    />
  )
}

export default AgeGroupItem
