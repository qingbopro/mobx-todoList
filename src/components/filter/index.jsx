import React, { Component } from 'react'
import { inject } from 'mobx-react'

@inject(stores => ({
  current: stores.store.current,
  filter: stores.store.filter
}))
class Filter extends Component {
  onClick = () => {
    this.props.filter(this.props.filterText)
  }
  render() {
    return (
      <button
        onClick={this.onClick}
        disabled={this.props.current === this.props.filterText}
      >
        {this.props.filterText}
      </button>
    )
  }
}

export default Filter
