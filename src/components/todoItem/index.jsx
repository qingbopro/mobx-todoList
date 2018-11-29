import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject(res => ({
  deleteTodo: res.store.deleteTodo,
  check: res.store.check
}))
@observer
class TodoItem extends Component {
  onClick = () => {
    this.props.deleteTodo(this.props.data.id)
  }
  onCheck = () => {
    this.props.check(this.props.data.id)
  }
  render() {
    return (
      <li
        style={{ textDecoration: this.props.data.completed ? 'line-through' : 'none' }}
      >
        <input
          type="checkbox"
          checked={this.props.data.completed}
          onChange={this.onCheck}
        />
        {this.props.data.text} <button onClick={this.onClick}>X</button>
      </li>
    )
  }
}

export default TodoItem
