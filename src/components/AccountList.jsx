import React from 'react';
import {  Link } from "react-router-dom";

import './AccountList.css';
import { ADD_ACCOUNT, VIEW_ACCOUNT } from '../AppRoute';


class AccountList extends React.Component {

    renderAccounts() {
        let {accounts} = this.props;

        return accounts.map((account) => {
            let bal = account.bal;
            let bcolor = bal.color();
            
            return (
                <Link key={account.id} className="rowLink" to={VIEW_ACCOUNT.replace(":id", account.id)}>
                    <div className="accountName" >{account.name}</div><div className="accountBal" style={{color:bcolor}}>{bal.prettyString()}</div>
                </Link>);
            
        });
    }

    render() {
        let accountRows = this.renderAccounts();
        return (
            <div className="App">
                <header className="headerBar">
                    <div className="buttonBar bbleft" ></div>
                    <div className="title"><h1>Family Accounts</h1></div>
                    <div className="buttonBar bbright"><Link className="barLink" to={ADD_ACCOUNT}>+</Link></div>
                </header>
                <div>{accountRows}</div>
            </div>   

        );
    }
}



export default AccountList;

