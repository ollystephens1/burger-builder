import React, { Component } from 'react';
import classes from './ContactData.css';
import instance from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

export default class ContactData extends Component {

  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Zip code'
        },
        value: '',
        validation: {
          required: true,
          minLenght: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email address'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fasted', displayValue: 'Fastest delivery'},
            { value: 'standard', displayValue: 'Normal delivery'}
          ]
        },
        value: '',
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
    loading: false
  }

  handleOrder = (event) => {
    event.preventDefault();
    
    this.setState({ loading: true });
    const formData = {};

    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
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

  checkValidity(value, rules) {
    let isValid = true;
    
    if (rules.required) {
      isValid = value.trim() !== '' && isValid; 
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  onInputChanged = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  }

  render() {
    const formElements = [];

    for (let key in this.state.orderForm) {
      formElements.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }

    let form = (
      <form onSubmit={this.handleOrder}>
        {formElements.map(formElement => (
          <Input key={formElement.id}
                 elementType={formElement.config.elementType}
                 elementConfig={formElement.config.elementConfig}
                 value={formElement.config.value} 
                 invalid={!formElement.config.valid}
                 shouldValidate={formElement.config.validation}
                 touched={formElement.config.touched}
                 changed={(event) => this.onInputChanged(event, formElement.id)}/>
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
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