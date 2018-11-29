import { observable, action, computed, autorun } from 'mobx'

class todos {
  constructor() {
    this.todoList = JSON.parse(localStorage.getItem('todoList')) || []
    autorun(() => {
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
    })
  }
  @observable todoList
  @observable current = 'all'

  @computed
  get filterList() {
    let filterList = []
    switch (this.current) {
      case 'completed':
        filterList = this.todoList.filter(item => item.completed)
        break
      case 'active':
        filterList = this.todoList.filter(item => !item.completed)
        break
      default:
        filterList = this.todoList
        break
    }
    return filterList
  }

  @action.bound
  addTodo(value) {
    this.todoList.push({
      text: value,
      id: new Date().getTime(),
      completed: false
    })
  }

  @action.bound
  check(id) {
    const index = this.todoList.findIndex(item => item.id === id)
    this.todoList[index].completed = !this.todoList[index].completed
  }

  @action.bound
  filter(value) {
    this.current = value
  }

  @action.bound
  deleteTodo(id) {
    const index = this.todoList.findIndex(item => item.id === id)
    this.todoList.splice(index, 1)
  }
}

export default new todos()
