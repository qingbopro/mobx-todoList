import { observable, action, computed, autorun, reaction, when } from 'mobx'

class todos {
  constructor() {
    this.todoList = JSON.parse(localStorage.getItem('todoList')) || []
    when(
      () => this.current === 'active',
      () => {
        console.log('when执行了，只会执行一次')
      }
    )
    autorun(() => {
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
      console.log('autorun创建时会先执行一次')
    })
    reaction(
      () => this.todoList,
      todoList => {
        console.log(todoList) // 不会响应 this.todoList ==== this.todoList
      }
    )
    reaction(
      () => this.todoList.length,
      length => {
        console.log(length) // 可以响应
        console.log('reaction创建时不会先执行一次')
      }
    )
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
