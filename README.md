# mobx-todolist-demo

## create-react-app 默认不支持装饰器语法的问题

1. 提取 webpack 配置

```shell
npm run eject
```

2. 安装 babel 装饰器插件

```shell
npm i @babel/plugin-proposal-decorators -D
```

3. 修改 babel 配置

修改 package.json 里 babel 字段

```json
{
  "babel": {
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ]
    ],
    "presets": ["react-app"]
  }
}
```

## mobx 用法

### 定义可观察属性

可以封装专门的全局 class 的形式

```javascript
class Store {
  @observable todoList
}
```

也可以在组件内定义，用来替代 state，进而不需要`this.setState`

```javascript
class extends Component{
  @observable todoList
  add(){
    this.todoList = []
  }
}
```

### 传递 store

可以将 store 作为普通的 props 传进去，子组件照常通过 props 获取 store 状态

```javascript
let store = new Store()
class extends Component{
  render(){
    return <App store={store}/>
  }
}
```

也可以用 `mobx-react` 的 `Provider` 组件全局传递。
必须用 store 属性传递

```javascript
<Provider store={store}>
  <App />
</Provider>
```

### 获取 store

如果是用 `Provider` 传递的

```javascript
@inject(res => ({
  todoList: res.store.todoList
}))
class extends Component{
  render(){
    return this.props.todoList.map(item => (<li>item.text</li>))
  }
}
```

或者。`@inject('store')`必须叫 store

```javascript
@inject('store')
class extends Component{
  render(){
    return this.props.store.todoList.map(item => (<li>item.text</li>))
  }
}
```

### 修改 store

`@action` 不是必须的，只要状态修改，视图都会更新，下面代码依然有效

```javascript
this.props.todoList.push({
  text: e.target.value,
  id: new Date().getTime(),
  completed: false
})
```

`bound` 用来绑定 `this` 到 `store`，建议所有方法都加上`@action.bound`

```javascript
class Store {
  @action.bound
  addTodo() {
    this.todoList.push({ text: 'todo' })
  }
}
```

### 响应 Store

#### @computed

不需要定义监听的状态，会自动根据内部引用的 `observable` 值变化而执行

`@computed` 不是必须的，不加仍然可以达到更新视图的效果。
`computed` 的意义在于，类似 `vue` 的 `computed`，有一个缓存效果。值没有变化则不会重新计算，也不会更新视图。

获取 `computed` 属性的方法和 `observable` 属性一样

```javascript
class Store {
  @computed
  get count() {
    return this.tatal + 1
  }
}
```

#### @autorun

和`computed`一样，根据内部引用的`observable`进行响应。区别在于`computed`用来给`observer`一个新的值以更新视图，`autorun`仅仅只是一个回调

```javascript
class todos {
  constructor() {
    autorun(() => {
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
    })
  }
}
```

#### @reaction

类似 `autorun`，区别在于 `reaction` 根据第一个函数参数返回的 `observable` 来响应。另外一个区别是，`autorun` 会在创建时先执行一次，reaction 要等到初始化并值变化后才会执行

第一个返回值会作为第二个函数的参数，第二个函数参数是响应的回调函数

注意引用类型问题，例如第一个函数参数返回值是`this.todoList`，对`this.todoList`进行`push`操作则无法响应。因为`this.todoList === this.todoList`。想解决这个问题可以`this.todoList.map(item => item)`的方式返回新的数组

```javascript
class todos {
  constructor() {
    reaction(
      () => this.current,
      current => {
        console.log(current)
      }
    )
  }
}
```

#### @when

用法和`reaction`一样，区别在于 when 的第一个函数参数返回值为 true 时执行一次后会被清理掉，不会执行第二次

```javascript
class todos {
  constructor() {
    when(
      () => this.current === 'active',
      () => {
        console.log('when 执行了，只会执行一次')
      }
    )
  }
}
```

## mobx 优化

`@observer` 组件会追踪它们使用的所有值，并且当它们中的任何一个改变时重新渲染。 所以你的组件越小，它们需要重新渲染产生的变化则越小

例如，如果在本 demo 中没有把 `todoItem`组件 拆除出 `todoList`组件，则每次勾选`todoItem`都会导致整个`todoList`的重渲染
