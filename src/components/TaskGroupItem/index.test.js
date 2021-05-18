import { getSubTaskGroupsOrTasksText } from './index'

const language = 'fi'

const taskGroup = {
  guid: '1234',
  tasks: [{ guid: '1' }, { guid: '2' }, { guid: '3' }],
  taskgroups: [{ guid: '4' }, { guid: '5' }, { guid: '6' }],
  languages: [{ lang: language, title: 'Sudenpennut' }],
}

const translated = {
  tasks: [{ guid: '1' }, { guid: '2' }],
  subGroups: [{ guid: '4' }, { guid: '5' }],
}

const itemsByGuid = {
  '1234': taskGroup,
}

const taskGroupItemProps = {
  taskGroup,
  ageGroupIndex: 2,
  language,
  tasksTerm: 'askelta',
}

describe('TaskGroupItem component', () => {
  it('renders the amounts of given subTaskGroups and tasks', () => {
    const text = getSubTaskGroupsOrTasksText(
      taskGroupItemProps.tasksTerm,
      taskGroupItemProps.taskGroup,
      language,
      itemsByGuid,
      translated
    )
    expect(text).toBe(
      `${translated.tasks.length} + ${translated.subGroups.length} ${taskGroupItemProps.tasksTerm}`
    )
  })
})
