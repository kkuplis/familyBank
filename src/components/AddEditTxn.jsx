import React from 'react';

import Txn, {possibleTxnTypes} from '../logic/Txn';
import Money from '../logic/Money';


import './AccountList.css';
import './TxnList.css';


class AddEditTxn extends React.Component {
    constructor(props) {
        super(props);

        let {accounts, txns, type} = props;

        let newState = {accounts:accounts};
        if (props.isNew) {
            let accountId = parseInt(props.match.params.id, 10);
            let account = accounts.find((x)=>{return x.id === accountId;})

            newState.title = "New " + type;
            newState.date = new Date().toDateString();
            newState.type = type;
            newState.desc = '';
            newState.amount = '';
            newState.account = account;
        
        } else {
            let txnId = parseInt(props.match.params.id, 10);
            let txn = txns.find((x)=>{return x.id === txnId;})

            newState.title = txn.title();
            newState.date = txn.date.toDateString();
            newState.type = txn.typeWithAccount();
            newState.desc = txn.desc;
            newState.amount = txn.editAmount().asString();
            newState.account = txn.fromAccount;
            newState.oldTxn = txn;
        }
        newState.types = possibleTxnTypes(accounts, newState.account);
        console.log(newState.types);
        this.state = newState;
    }


    clickSave = () => {
        var error;

        let money = new Money(this.state.amount);
        if (money.error) {
            error = {message:money.error};
        } else if (money.value < 0) {
            error = {message:'Please enter a positive amount.  Consider changing the type to change the effect of the amount.'};
        }
        let date = new Date(this.state.date);
        if (!this.state.date || 
            isNaN(date) || 
            Math.abs(date.getFullYear()- new Date().getFullYear()) > 1) {
            error = {message:'Please enter a valid Date mm/dd/yyyy'};
        } 

        if (money.value === 0 && this.state.desc.trim().length === 0) {
            error = {message:'Please enter either a non zero amount or a description.'}
        }

        if (error) {
            this.setState({error:error});
        } else {
            let newTxn = new Txn(this.state.date, this.state.type,  this.state.amount, this.state.account, this.state.desc);
            Txn.saveTxn(this.props.txns, newTxn, this.state.oldTxn, this.state.accounts);
            window.history.back();
        }
    }
    
    updateInput(key, value) {
        // update react state
        if (key === 'type') {
            let title = this.state.types.find((x) => {return x.value === value}).name;
            this.setState({type:value, error:null,title:title})
        } else {
            this.setState({[key]: value, error:null});
        }
    }

    validateDate(value) {
        let theDate = new Date(value);
        if (isNaN(theDate) || 
            Math.abs(theDate.getFullYear()- new Date().getFullYear()) > 1) {
            this.setState({error:{message:'Please enter a valid Date mm/dd/yyyy'}});
        } else {
            this.setState({date:theDate.toDateString()});
        }
    }


    render() {
        let ttypes = this.state.types.map((typeObj) => {
            return (<option  key={typeObj.value} value={typeObj.value}>{typeObj.name}</option>);
        });
        return (
            <div className="App">
                <header className="headerBar">
                    <div className="buttonBar bbleft" onClick={() => {window.history.back()}} >cancel</div>
                    <div className="title"><h1>{this.state.title}</h1></div>
                    <div className="buttonBar bbright"  onClick={this.clickSave}>save</div>
                </header>
                <div className='inputWrap'> 
                {this.state.error && <p style={{color:'red' }}>{this.state.error.message}</p>}
         
                    <input
                        type="text"
                        value={this.state.date}
                        onKeyPress={e=>{if (e.key === 'Enter') {this.validateDate(e.target.value);} }}
                        onChange={e => this.updateInput("date", e.target.value)}
                    />
                    <p className='inputDesc'>Date</p>
                    <p><select className="txnTypeSelect" defaultValue={this.state.type} onChange={e => this.updateInput("type", e.target.value)}>
                        {ttypes}                 
                     </select></p>
                    <p className='inputType'>Type</p>
                    <input
                        type="text"
                        value={this.state.desc}
                        onChange={e => this.updateInput("desc", e.target.value)}
                    />
                    <p className='inputDesc'>Description</p>
                    <input
                        type="number"
                        value={this.state.amount}
                        onChange={e => this.updateInput("amount", e.target.value)}
                    />
                    <p className='inputDesc'>Amount</p>

                </div>           
            </div>   
        );
        
    }
}



export default AddEditTxn;