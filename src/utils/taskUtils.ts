import { type Cards } from '../types'

export const updateTaskInList = (list: Cards[], updated: Cards): Cards[] =>
  list.map((task) =>
    task.title === updated.title ? { ...task, ...updated } : task
  )

export const removeTaskFromList = (list: Cards[], title: string): Cards[] =>
  list.filter((task) => task.title !== title)

export const moveTaskBetweenLists = (
  fromList: Cards[],
  toList: Cards[],
  task: Cards,
  index: number,
  newStatus: string
) => {
  const updatedFromList = [...fromList.slice(0, index), ...fromList.slice(index + 1)]
  const updatedToList = [...toList, { ...task, status: newStatus }]
  return { updatedFromList, updatedToList }
}
