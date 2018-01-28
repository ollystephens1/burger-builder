import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import instance from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: .5,
  cheese: .3,
  meat: 1.3,
  bacon: .7
};

class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 0,
      cheese: 0,
      meat: 0,
      bacon: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false
  }

  addIngredient = (type) => {
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount + 1;
    const upgradedIngredients = {...this.state.ingredients};
    upgradedIngredients[type] = newCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ ingredients: upgradedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(upgradedIngredients);
  }

  removeIngredient = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }

    const newCount = oldCount - 1;
    const upgradedIngredients = {...this.state.ingredients};
    upgradedIngredients[type] = newCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ ingredients: upgradedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(upgradedIngredients); 
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey]
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);
    
    this.setState({ purchasable: sum > 0 });
  }

  makePurchase = () => {
    this.setState({ purchasing: true });
  }

  cancelPurchase = () => {
    this.setState({ purchasing: false });
  }

  continuePurchase = () => {
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }

    queryParams.push('price=' + this.state.totalPrice);

    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryParams.join('&')
    });
  }

  render() {
    const disabledInfo = {...this.state.ingredients};

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = (
      <OrderSummary ingredients={this.state.ingredients} 
                        purchaseCancelled={this.cancelPurchase}
                        purchaseContinued={this.continuePurchase}
                        price={this.state.totalPrice}/>
    )
    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.cancelPurchase}>
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls ingredientAdded={this.addIngredient} 
                        ingredientRemoved={this.removeIngredient}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        order={this.makePurchase}
                        purchasable={this.state.purchasable}/>
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, instance);