import React, { Component } from 'react';
import classes from './ContactData.css';
import instance from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

export default class ContactData extends Component {

  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false
  }

  handleOrder = (event) => {
    event.preventDefault();
    
    this.setState({ loading: true });

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Max Smith',
        address: {
          street: '10 King Road',
          zipCode: '89732',
          country: 'United Kingdom'
        },
        email: 'test@test.com',
        deliveryMethod: 'express'
      }
    }

    instance.post('https://burger-builder-ef06c.firebaseio.com//orders.json', order)
    .then(response => {
      console.log(response);
      this.setState({ loading: false });
      this.props.history.push('/');
    }).catch(err => {
      console.log(err);
      this.setState({ loading: true });
    });
  }

  render() {
    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="Your name" />
        <input className={classes.Input} type="email" name="email" placeholder="Your email address" />
        <input className={classes.Input} type="text" name="street" placeholder="Street" />
        <input className={classes.Input} type="text" name="postalCode" placeholder="Postcode" />
        <br />
        <Button btnType="Success" clicked={this.handleOrder}>Order</Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}