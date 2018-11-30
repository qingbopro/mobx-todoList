import React, { Component } from 'react'
import './App.css'

import AddTodo from './components/addTodo'
import TodoList from './components/todoList'
import Filter from './components/filter'
import { inject, observer } from 'mobx-react'

import { FILTER_ALL, FILTER_COMPLETED, FILTER_ACTIVE } from './config'
@inject(res => ({
  filterList: res.store.filterList
}))
@observer
class TotalCount extends Component {
  render() {
    return <span>{this.props.filterList.length}</span>
  }
}

class App extends Component {
  render() {
    return (
      <div id="App">
        <header>
          <AddTodo />
        </header>
        <main>
          <TodoList />
        </main>
        <footer>
          总共：
          <TotalCount />
          <Filter filterText={FILTER_ALL} />
          <Filter filterText={FILTER_COMPLETED} />
          <Filter filterText={FILTER_ACTIVE} />
        </footer>
      </div>
    )
  }
}

export default App
