import React from 'react'
import ListItem from 'components/ListItem'
import { ageGroupIcons } from 'graphics/ageGroups'

const AgeGroupItem = ({ ageGroup, language, subTitle }) => {
  const languageInfo = ageGroup.item.languages.find(x => x.lang === language)

  return (
    <ListItem
      guid={ageGroup.guid}
      ageGroupGuid={ageGroup.ageGroupGuid}
      title={languageInfo ? languageInfo.title : ageGroup.title}
      subTitle={subTitle}
      language={language}
      icon={
        ageGroupIcons[`AgeGroupIcon${ageGroup.guid}`] ||
        ageGroupIcons.AgeGroupIconDefault
      }
    />
  )
}

export default AgeGroupItem
