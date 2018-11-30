import React, { Component } from 'react'
import TodoItem from '../todoItem'
import { inject, observer } from 'mobx-react'

@inject(res => ({
  filterList: res.store.filterList
}))
@observer
class TodoList extends Component {
  render() {
    const filterList = this.props.filterList
    return (
      <div>
        <ul>
          {filterList.map(item => (
            <TodoItem item={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }
}

export default TodoList
