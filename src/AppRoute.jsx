import React from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";

import AccountList from './components/AccountList';
import AddEditAccount from './components/AddEditAccount';
import AddEditTxn from './components/AddEditTxn';
import TxnList from './components/TxnList';
import { TxnType } from "./logic/Txn";

export const ACCOUNT_LIST = '/account-list';
export const ADD_ACCOUNT = '/add-account';
export const EDIT_ACCOUNT = '/edit-account/:id';
export const VIEW_ACCOUNT = '/view-account/:id';
export const ADD_GET_TXN = '/add-get-txn/:id';
export const ADD_SPEND_TXN = '/add-spend-txn/:id';
export const ADD_GIVE_TXN = '/add-give-txn/:id';
export const EDIT_TXN = '/edit-txn/:id';



const AppRouter = (props) => {
    let {accounts, txns} = props; 
    return (
  <Router   {...props}>
      
    <div>
      <Route path="/" exact render={props => <AccountList 
                    {...props}
                    accounts={accounts}
                    txns = {txns}
                   />} />
      <Route path={ACCOUNT_LIST} 
                render={props => <AccountList
                    accounts={accounts}
                    txns = {txns} 
                    {...props}
                   />}/>
      <Route path={ADD_ACCOUNT} render={props => <AddEditAccount 
                      key = {0}
                      isNew = {true}
                      accounts={accounts}
                      txns = {txns}
                      {...props}
      /> } />
      <Route path={EDIT_ACCOUNT} render={props => <AddEditAccount 
                        accounts={accounts}
                        txns = {txns}
                       {...props}
      /> } />
      <Route path={VIEW_ACCOUNT} render={props =>  <TxnList
                        accounts={accounts}
                        txns = {txns}
                        {...props}
                    />} />
      <Route path={ADD_GET_TXN} render={props =>  <AddEditTxn 
                      isNew = {true} 
                      accounts={accounts}
                      txns = {txns}
                      type = {TxnType.DEPOSIT}

                      {...props}

                    />} />
      <Route path={ADD_SPEND_TXN} render={props =>  <AddEditTxn 
                      isNew = {true} 
                      accounts={accounts}
                      txns = {txns}
                      type = {TxnType.SPEND}

                      {...props}

                    />} />
      <Route path={ADD_GIVE_TXN} render={props =>  <AddEditTxn 
                      isNew = {true} 
                      accounts={accounts}
                      txns = {txns}
                      type = {TxnType.DONATE}

                      {...props}

                    />} />
      <Route path={EDIT_TXN} render={props =>  <AddEditTxn
                        accounts={accounts}
                        txns = {txns}
                      {...props}
                    />} />
      </div>
  </Router>
);
}

export default AppRouter;