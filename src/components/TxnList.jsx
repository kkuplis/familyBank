import React from 'react';
import {  Link } from "react-router-dom";

import './AccountList.css';
import './TxnList.css';
import { ACCOUNT_LIST, EDIT_ACCOUNT, ADD_GET_TXN, ADD_SPEND_TXN, ADD_GIVE_TXN, EDIT_TXN} from '../AppRoute';

class TxnList extends React.Component {
    constructor(props) {
        super(props);

        let accountId = parseInt(props.match.params.id, 10);
        let account = props.accounts.find((x)=>{return x.id === accountId;})

        this.state = {
            account:account,
        };
    }


    renderTxns() {
        var txns = this.state.account.txns;
        var txnRows = [];
        txns.forEach((yearObj) => {
            yearObj.txns.forEach((monthObj)=> {
                monthObj.txns.forEach((txn)=> {
                    let bcolor = txn.amount.color();
                    txnRows.push(<Link key={txn.id} className="txnRowLink" to={EDIT_TXN.replace(":id", txn.id)}>
                                    <div className="txnDate">{txn.date.getMonth()+1 + '/' + txn.date.getDate() + '/' + txn.date.getFullYear()}</div>
                                    <div className='txnType'>{txn.type}</div>
                                    <div className='txnDesc'>{txn.desc}</div>
                                    <div className='txnAmt' style={{color:bcolor}}>{txn.amount.prettyString()}</div>
                                </Link>);
                });
            });
        });
        return txnRows;
    }

    render() {
        let account = this.state.account;
        if (!account) {
            return (<div>Loading</div>);
        }
        let bcolor = account.bal.color();
        let txns = this.renderTxns();
        return (
            <div className="App">
                <header className="headerBar">
                    <div className="buttonBar bbleft"><Link className="barLink" to={ ACCOUNT_LIST}>All Accounts</Link></div>
                    <div className="title"><h1>{account.name}</h1></div>
                   <div className="buttonBar bbright" ><Link className = "barLink" to={ EDIT_ACCOUNT.replace(":id", this.state.account.id)}>edit</Link></div>
                </header>
                <div className="bigBal" style={{color:bcolor}}>{account.bal.prettyString()}</div>
                <div className="newTxns">
                    <div><Link className="newTxnLink" to={ADD_GET_TXN.replace(":id", this.state.account.id)}>Get</Link></div>
                    <div><Link className="newTxnLink" to={ADD_SPEND_TXN.replace(":id", this.state.account.id)}>Spend</Link></div>
                    <div><Link className="newTxnLink" to={ADD_GIVE_TXN.replace(":id", this.state.account.id)}>Give</Link></div>
                </div>
                <div className='txnDetails'>{txns}</div>
            </div>   

        );
        
    }
}



export default TxnList;