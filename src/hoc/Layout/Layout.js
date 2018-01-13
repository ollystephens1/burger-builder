import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

  state = {
    showSideDraw: false
  }

  sidedrawClosed = () => {
    this.setState({ showSideDraw: false });
  }

  sidedrawToggled = () => {
    this.setState((prevState) => { 
      return { showSideDraw: !prevState.showSideDraw }
    });
  }

  render() {
    return (
      <Aux>
        <Toolbar drawerToggleClicked={this.sidedrawToggled}/>
        <SideDrawer open={this.state.showSideDraw} closed={this.sidedrawClosed}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
      );
  }
}

export default Layout;
