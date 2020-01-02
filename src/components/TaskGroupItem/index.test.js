import { getSubTaskGroupsOrTasksText } from './index'

const taskGroupItemProps = {
  taskGroup: {
    guid: '1234',
    tasks: [{ guid: '1' }, { guid: '2' }, { guid: '3' }],
    taskgroups: [{ guid: '4' }, { guid: '5' }, { guid: '6' }],
    languages: [{ lang: 'fi', title: 'Sudenpennut' }],
  },
  ageGroupIndex: 2,
  language: 'sv',
  tasksTerm: 'askelta',
}

describe('TaskGroupItem component', () => {
  it('renders the amounts of given subTaskGroups and tasks', () => {
    const text = getSubTaskGroupsOrTasksText(
      taskGroupItemProps.tasksTerm,
      taskGroupItemProps.taskGroup
    )
    expect(text).toBe(
      `${taskGroupItemProps.taskGroup.tasks.length} + ${taskGroupItemProps.taskGroup.taskgroups.length} ${taskGroupItemProps.tasksTerm}`
    )
  })
})
