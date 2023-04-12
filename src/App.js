import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = product => {
    const {cartList} = this.state
    if (cartList.length === 0)
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    //   TODO: Update the code here to implement addCartItem
    else {
      const obj = cartList.filter(each => each.id === product.id)
      if (obj.length === 0) {
        this.setState(prevState => ({
          cartList: [...prevState.cartList, product],
        }))
      } else {
        const updatedObj = {...obj[0], quantity: obj[0].quantity + 1}
        const index = cartList.indexOf(obj[0])
        cartList.splice(index, 1, updatedObj)
        this.setState({cartList})
      }
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updatedList = cartList.filter(eachItem => eachItem.id !== id)
    this.setState({cartList: updatedList})
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const obj = cartList.filter(each => each.id === id)[0]
    if (obj.quantity > 1) {
      const index = cartList.indexOf(obj)
      const updatedObj = {...obj, quantity: obj.quantity - 1}
      cartList.splice(index, 1, updatedObj)
    } else if (obj.quantity === 1) {
      const index = cartList.indexOf(obj)
      cartList.splice(index, 1)
    }
    this.setState({cartList})
  }

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    const obj = cartList.filter(each => each.id === id)[0]
    const index = cartList.indexOf(obj)
    const updatedObj = {...obj, quantity: obj.quantity + 1}
    cartList.splice(index, 1, updatedObj)
    this.setState({cartList})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
