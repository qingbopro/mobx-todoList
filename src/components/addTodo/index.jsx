import React, { Component } from 'react'
import { inject } from 'mobx-react'

@inject(res => ({
  addTodo: res.store.addTodo
}))
class AddTodo extends Component {
  onKeyUp = e => {
    if (e.keyCode !== 13 || !e.target.value.trim()) {
      return
    }
    this.props.addTodo(e.target.value)
    e.target.value = ''
  }
  render() {
    return <input type="text" onKeyUp={this.onKeyUp} />
  }
}

export default AddTodo
