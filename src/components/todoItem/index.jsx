import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject(res => ({
  deleteTodo: res.store.deleteTodo,
  check: res.store.check
}))
@observer
class TodoItem extends Component {
  onClick = () => {
    this.props.deleteTodo(this.props.item)
  }
  onCheck = () => {
    this.props.check(this.props.item)
  }
  render() {
    return (
      <li
        style={{ textDecoration: this.props.item.completed ? 'line-through' : 'none' }}
      >
        <input
          type="checkbox"
          checked={this.props.item.completed}
          onChange={this.onCheck}
        />
        {this.props.item.text} <button onClick={this.onClick}>X</button>
      </li>
    )
  }
}

export default TodoItem
