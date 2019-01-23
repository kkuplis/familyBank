import React from 'react';

import './AccountList.css';
import Account from '../logic/Account';
import Txn from '../logic/Txn';



class AddEditAccount extends React.Component {
    constructor(props) {
        super(props);

        let accountId = parseInt(props.match.params.id, 10);
        let account = props.accounts.find((x)=>{return x.id === accountId;})
        var name = '';
        if (account) {
            name = account.name;
        }

        this.state = {
            inAccount:account,
            newName:name,
            newBal:"",
        };
    }


    clickSave = () => {
        if (this.state.newName) {
            var account;
            if (this.props.isNew) {
                account = new Account(this.state.newName.slice());
            } else {
                account = this.state.inAccount;
                account.name = this.state.newName.slice();
            }
            Account.saveAccount(account, this.props.accounts);

            if (this.state.newBal) {
                Txn.createOpeningBalance(this.props.txns, account, this.state.newBal);
            }

            window.history.back(); // Check if this refreshes (otherwise need to navigate forward)
        }
    }
    
    updateInput(key, value) {
        // update react state
        this.setState({ [key]: value });
    }

    render() {
        var title;
        if (this.props.isNew) {
            title = 'New Account';
        } else if (!this.state.inAccount) {
            return (<div>Need Account to Edit an Account</div>);
        } else {
            title = this.state.newName;
        }

        let disabled = !this.props.isNew && this.state.inAccount.numTxns > 0 ;
        let bal = disabled ? this.state.inAccount.bal.prettyString() : this.state.newBal;
        let bcolor = disabled ? this.state.inAccount.bal.color() : '';
        return (
            <div className="App">
                <header className="headerBar">
                    <div className="buttonBar bbleft" onClick={() => {window.history.back()}} >cancel</div>
                    <div className="title"><h1>{title}</h1></div>
                    <div className="buttonBar bbright" onClick={this.clickSave}>save</div>
                </header>
                <div className='inputWrap'>          
                    <input
                        type="text"
                        value={this.state.newName}
                        onChange={e => this.updateInput("newName", e.target.value)}
                    />
                    <p className='inputDesc'>account name</p>
                    <input
                        type="number"
                        hidden={disabled}
                        value={bal}
                        onChange={e => this.updateInput("newBal", e.target.value)}
                    />
                    <p className="disabledBalance" hidden={!disabled} style={{color:bcolor}}>{bal}</p>
                    <p className='inputDesc'>current Balance</p>
                </div>
            </div>   

        );
        
    }
}



export default AddEditAccount;