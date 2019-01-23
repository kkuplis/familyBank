import Money from './Money'
import { remove} from './ArrayUtils';

export const TxnType = {
    DEPOSIT: "Deposit",
    SPEND : 'Spend',
    DONATE: "Donate",
    GIVE : 'Give',
    GET : 'Get',
    ALLOWANCE : 'Allowance',  
    INTEREST : 'Interest',    
}
   
export const possibleTxnTypes = (accounts, excludedAccount) => {
    let types = [];
    for (var key in TxnType) {
        let type = TxnType[key];
        if (type === TxnType.GET || type === TxnType.GIVE) {
            accounts.forEach((account) => {
                if (excludedAccount !== account) {
                    let value = type + ":" + account.id;
                    let direction = type === TxnType.GET ? ' money from ' : ' money to ';
                    let name =type + direction + account.name;
                    types.push({value:value, name:name})
                }
            });
        } else {
            types.push({value:type, name:type});
        }
    }
    return types;
}

class Txn {
    id;
    date;
    type;
    fromAccount;
    toAccount;  // only used for Give and Get
    pairTxn;    // only used for Give and Get
    amount;
    desc;
    lastEdited;

    

    constructor (date, type, amount, fromAccount, desc) {
        this.date = new Date(date);
        this.type = type;
        this.amount = new Money(amount);
        this.desc = desc;

        this.fromAccount = fromAccount;
    }

    

    editAmount() {
        return this.amount.abs();
    }

    title() {
        if (!this.type) {
            return "";
        }
        
        if (this.type === TxnType.GET) {
            return TxnType.GET + ' money from ' + this.toAccount.name;
        } else if (this.type === TxnType.GIVE) {
            return TxnType.GIVE + ' money to ' + this.toAccount.name;
        }
        
        return this.type;
    }

    typeWithAccount() {
        if (!this.type) {
            return "";
        }
        
        if (this.type === TxnType.GET || this.type === TxnType.GIVE) {
            return this.type + ':' + this.toAccount.id;
        }
        
        return this.type;
    }

    typeHasToAccount() {
        return this.type === TxnType.GET || this.type === TxnType.GIVE;
    }

    // Don't export accounts
    toJSON(key) {
        var obj = {};
        for (var prop in this) {
            switch (prop) {
                case 'toAccount': 
                    obj.toAccountId = this.toAccount.id;
                    break;
                case 'fromAccount':
                    obj.fromAccountId = this.fromAccount.id;
                    break;
                case 'pairTxn':
                    obj.pairTxnId = this.pairTxn.id;
                    break;
                default:
                    obj[prop] = this[prop];
            }
        }
        return obj;
    }


    removeTxn(txns) {
        remove(txns, this);
        let val = this.amount.value;
        this.fromAccount.bal.value -= val; // remove amount from account total
        this.fromAccount.numTxns--;
        let txnList = this.fromAccount.txns;
        let txnDate = this.date;
        let yearList =  txnList.find((x)=>{return x.year === txnDate.getFullYear()});
        yearList.bal.val -= val; // remove amount from year total
        yearList.numTxns--;
        let monthList = yearList.txns.find((x)=>{return x.month === txnDate.getMonth()});
        monthList.bal.val -= val; // remove amount from month total
        monthList.numTxns--;
        remove(monthList.txns, this);
    }

    /**
     * accounts hold a txns obj that has an array of years, each of which has an array of month, array of txns with totals at each level
     */
    addTxn() {
        // don't allow oldTxns to be modified :)
        Object.freeze(this);
        let val = this.amount.value; // add txn to account total
        this.fromAccount.bal.value += val;
        this.fromAccount.numTxns++;
        let txnList = this.fromAccount.txns;
        let txnDate = this.date;
        let newId = this.id;
        var yearList;
        var monthList;

        // find year or year insertion
        let yearIndex = txnList.findIndex((x)=>{return x.year <= txnDate.getFullYear();});
        if (yearIndex >= 0 && txnList[yearIndex].year === txnDate.getFullYear()) {
            let yearObj = txnList[yearIndex];
            yearList = yearObj.txns;
            yearObj.bal.value += val; // add txn to yearly total
            yearObj.numTxns++; // add Txn to txn total
        } else {
            if (yearIndex < 0) {
                yearIndex = txnList.length; // if no years are lower, add to the end of the yearList
            }
            // Add new yearObj
            yearList = [];
            txnList.splice(yearIndex, 0, {year:txnDate.getFullYear(), txns:yearList, bal : new Money(val), numTxns:1});
        }

        // find month or month insertion
        let monthIndex = yearList.findIndex((x)=>{return x.month <= txnDate.getMonth();});
        if (monthIndex >= 0 && yearList[monthIndex].month === txnDate.getMonth()) {
            let monthObj = yearList[monthIndex];
            monthList = monthObj.txns;
            monthObj.bal.value += val; // add txn to monthly total
            monthObj.numTxns++; // add txn to txn total

            // find txn insertion
            let txnIndex = monthList.findIndex((x)=>{
                let diff = x.date.getDate() - txnDate.getDate();
                if (diff === 0) { // Same time
                    return x.id < newId;
                }
                return diff < 0});
            if (txnIndex < 0) { txnIndex = monthList.length;}
            monthList.splice(txnIndex, 0, this);
        } else {
            if (monthIndex <  0) {
                monthIndex = yearList.length; // if no month are lower, add to the end of the monthList
            }
            // add new monthObj with txn
            monthList = [this];
            let monthObj = {month:txnDate.getMonth(), txns:monthList, bal : new Money(val), numTxns:1};
            yearList.splice(monthIndex, 0, monthObj);

        }

        
    }


    fixType(accounts) {

        let typeparts = this.type.split(":");

        if (typeparts[0] === TxnType.GET || typeparts[0] === TxnType.GIVE) {
            // make sure there is a valid toAccount
            if (accounts && typeparts.length > 1) {
                let account = accounts.find((x)=>{
                    return x.id === parseInt(typeparts[1], 10);
                });
                if (account) {
                    this.toAccount = account;
                    this.type = typeparts[0];
                }
            }
        } else {
            this.type = typeparts[0];
        }
        if (!Txn.validType(this.type)) {
            // if type isn't valid, just call it a spend
            this.type = TxnType.SPEND;
        }
    }

    fixAmount() {
        let amount = new Money(this.amount).abs();

        switch (this.type) {
            case TxnType.SPEND:
            case TxnType.GIVE:
            case TxnType.DONATE:
                amount.value *= -1;
                break;
            default:
                // nothing to do here :)
                break;
        }
        this.amount = amount;
    }

    fixDate() {
        let date = new Date (this.date);
        if (isNaN(date)) {
            date = new Date();
        } 
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        this.date = date;
    }
    

    static saveTxn (txns, newTxn, oldTxn, accounts) {
        // force valid types, dates and amounts
        newTxn.fixType(accounts);
        newTxn.fixDate();
        newTxn.fixAmount();
        newTxn.lastEdited = new Date();

        var nextId = txns.reduce((start, x)=>{return x.id >= start ? x.id + 1 : start }, 1);
        // TODO deal with pair Give / Get txns
        var oldPairId;

        // Ensure id is properly set and remove oldTxn(s) from lists
        if (oldTxn) {
            newTxn.id = oldTxn.id;
            if (oldTxn.pairTxn) {
                oldPairId = oldTxn.pairTxn.id;
                oldTxn.pairTxn.removeTxn(txns);
            }
            oldTxn.removeTxn(txns);
        } else {
            newTxn.id = nextId;
            nextId++;

        }

        if (newTxn.toAccount) {
            let newPairTxn = new Txn(newTxn.date, 
                newTxn.type === TxnType.GET ? TxnType.GIVE : TxnType.GET,
                new Money(-newTxn.amount.value),
                newTxn.toAccount,
                newTxn.desc);

            newPairTxn.toAccount = newTxn.fromAccount;
            newPairTxn.pairTxn = newTxn;
            if (oldPairId) {
                newPairTxn.id = oldPairId;
            } else {
                newPairTxn.id = nextId;
                nextId++;
            }
            newTxn.pairTxn = newPairTxn;

            newPairTxn.addTxn();
            txns.push(newPairTxn);
        }
        newTxn.addTxn();
        txns.push(newTxn);
        localStorage.setItem("txns", JSON.stringify(txns));
    }

    static createFromJSON( obj, accounts) {
        let fromAccount = accounts.find((x)=>{return x.id === obj.fromAccountId;});

        let txn = new Txn(obj.date, obj.type, obj.amount, fromAccount, obj.desc);
        txn.id = obj.id;
        txn.pairTxnId = obj.pairTxnId;
        txn.lastEdited = new Date(obj.lastEdited);
        return txn;
    }

    static readTxns(accounts) {
        var txns;
        if (localStorage.hasOwnProperty('txns')) {
            let value = localStorage.getItem('txns');
            let list = JSON.parse(value);
            txns = list.map((o) => {
                return Txn.createFromJSON(o, accounts);
            });
            // fill in pairTxn info
            txns.forEach((txn)=> {
                if (txn.pairTxnId) {
                    txn.pairTxn = txns.find((x)=>{return x.id === txn.pairTxnId;});
                    txn.toAccount = txn.pairTxn.fromAccount;
                }
            });
            // can't add txns until done inializing them
            txns.forEach((txn)=> {
                txn.addTxn();
            });
        }  
        return txns ? txns : [];
    }

    static validType (type) {
        if (!type) return false;
        return Object.keys(TxnType).some((x)=>{return TxnType[x] === type;});

    }
    static createOpeningBalance (txns, account, amount) {
        amount = new Money(amount);
        var type = TxnType.DEPOSIT;
        if (amount.value === 0) {
            return;
        } else if (amount.value < 0) {
            amount.value *= -1;
            type = TxnType.SPEND;
        }
        let newTxn = new Txn(new Date(), type, amount, account, 'Staring balance');
        Txn.saveTxn(txns, newTxn);
    }

}


export default Txn;