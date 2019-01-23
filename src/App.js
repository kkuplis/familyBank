import React, { Component } from 'react';
import './App.css';
import Account from './logic/Account';
import Txn from './logic/Txn';
import AppRouter from './AppRoute';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        accounts: [],
        txns:[],
        waitingToLoad:true,
      }
  }


  render() {
    if (this.state.waitingToLoad) {
      return (<div>Loading</div>);
    }

    return (<AppRouter   
      accounts={this.state.accounts}
      txns={this.state.txns}
      />); 
  }

  componentDidMount() {
    let accounts = Account.readAccounts();
    let txns = Txn.readTxns(accounts);

    this.setState( {
      accounts: accounts,
      txns : txns,
      waitingToLoad:false,
    });
  }
}



export default App;
