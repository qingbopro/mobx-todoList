import { observable, action, computed, autorun, reaction, when } from 'mobx'

class todo {
  constructor(value) {
    this.text = value
    this.id = new Date().getTime()
    this.completed = false
  }
}

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
        console.log('reaction todoList', todoList) // 不会响应 this.todoList ==== this.todoList
      }
    )
    reaction(
      () => this.todoList.length,
      length => {
        console.log('reaction length', length) // 可以响应
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
    this.todoList.push(new todo(value))
  }

  @action.bound
  check(item) {
    item.completed = !item.completed
  }

  @action.bound
  filter(value) {
    this.current = value
  }

  @action.bound
  deleteTodo(item) {
    const index = this.todoList.findIndex(value => value === item)
    this.todoList.splice(index, 1)
  }
}

export default new todos()
