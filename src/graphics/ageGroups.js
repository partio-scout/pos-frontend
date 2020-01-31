// Sudenpennut
import AgeGroup053fa231362e95cb211c5eb85c3cbedb from './ageGroups/053fa231362e95cb211c5eb85c3cbedb'
// Seikkailijat
import AgeGroup4ed7e03516698ffba67d342b529358c0 from './ageGroups/4ed7e03516698ffba67d342b529358c0'
// Tarpojat
import AgeGroupfd0083b9a325c06430ba29cc6c6d1bac from './ageGroups/fd0083b9a325c06430ba29cc6c6d1bac'
// Samoajat
import AgeGroup3ef690e4499894ed34577c83fdae7786 from './ageGroups/3ef690e4499894ed34577c83fdae7786'
// Vaeltajat
import AgeGroup0fe4dd441b0708f6bbff580d62392080 from './ageGroups/0fe4dd441b0708f6bbff580d62392080'
//Perhepartio
import AgeGroupe13d38602cec28781ed110c008385552 from './ageGroups/e13d38602cec28781ed110c008385552'
import AgeGroupDefault from 'assets/ageGroups/default.svg'

//full icons

// Sudenpennut
import AgeGroupIcon053fa231362e95cb211c5eb85c3cbedb from 'assets/ageGroups/053fa231362e95cb211c5eb85c3cbedb.svg'
// Seikkailijat
import AgeGroupIcon4ed7e03516698ffba67d342b529358c0 from 'assets/ageGroups/4ed7e03516698ffba67d342b529358c0.svg'
// Tarpojat
import AgeGroupIconfd0083b9a325c06430ba29cc6c6d1bac from 'assets/ageGroups/fd0083b9a325c06430ba29cc6c6d1bac.svg'
// Samoajat
import AgeGroupIcon3ef690e4499894ed34577c83fdae7786 from 'assets/ageGroups/3ef690e4499894ed34577c83fdae7786.svg'
// Vaeltajat
import AgeGroupIcon0fe4dd441b0708f6bbff580d62392080 from 'assets/ageGroups/0fe4dd441b0708f6bbff580d62392080.svg'
//Perhepartio
import AgeGroupIcone13d38602cec28781ed110c008385552 from 'assets/ageGroups/e13d38602cec28781ed110c008385552.svg'

import { getAgeGroupCompletion, getCompletedTaskGroups } from 'helpers'

const ageGroupGraphics = {
  AgeGroup053fa231362e95cb211c5eb85c3cbedb,
  AgeGroup4ed7e03516698ffba67d342b529358c0,
  AgeGroupfd0083b9a325c06430ba29cc6c6d1bac,
  AgeGroup3ef690e4499894ed34577c83fdae7786,
  AgeGroup0fe4dd441b0708f6bbff580d62392080,
  AgeGroupe13d38602cec28781ed110c008385552,
  AgeGroupDefault,
}

export const ageGroupIcons = {
  AgeGroupIcon053fa231362e95cb211c5eb85c3cbedb,
  AgeGroupIcon0fe4dd441b0708f6bbff580d62392080,
  AgeGroupIcon3ef690e4499894ed34577c83fdae7786,
  AgeGroupIcon4ed7e03516698ffba67d342b529358c0,
  AgeGroupIcone13d38602cec28781ed110c008385552,
  AgeGroupIconfd0083b9a325c06430ba29cc6c6d1bac,
  AgeGroupIconDefault: AgeGroupDefault,
}

export const getAgeGroupIcon = (ageGroup, userTasks, loggedIn) => {
  let graphics = ageGroupGraphics.AgeGroupDefault
  const ageGraphics = ageGroupGraphics[`AgeGroup${ageGroup.guid}`]
  if (ageGraphics) {
    if (loggedIn) {
      if (ageGraphics.length === 2) {
        const isAgeGroupComplete = getAgeGroupCompletion(
          ageGroup.item,
          userTasks
        )
        if (!isAgeGroupComplete) {
          const ageImage = ageGraphics.find(
            graphics => graphics.taskGroups.length === 0
          )
          if (ageImage) {
            graphics = ageImage.image
          }
        } else {
          const ageImage = ageGraphics.find(group =>
            group.taskGroups.includes(ageGroup.guid)
          )

          if (ageImage) {
            graphics = ageImage.image
          }
        }
      } else {
        const completedGroups = getCompletedTaskGroups(ageGroup.item, userTasks)
        const ageImage = ageGraphics
          .sort((a, b) => b.taskGroups.length - a.taskGroups.length)
          .find(group =>
            group.taskGroups.every(taskGroup =>
              completedGroups.includes(taskGroup)
            )
          )
        if (ageImage) {
          graphics = ageImage.image
        }
      }
    } else {
      const ageImage = ageGraphics.find(group =>
        group.taskGroups.includes(ageGroup.guid)
      )

      if (ageImage) {
        graphics = ageImage.image
      }
    }
  }
  return graphics
}
