import Money from "./Money"

export const Frequency = {
    MANUALY: 'Manually',
    WEEKLY: 'Weekly',
    BIWEEKLY : 'Biweekly',
    SEMI_MONTHLY: 'Semi-Monthly',
    MONTHLY:'Monthly',
    QUARTERLY : 'Quarterly',
    ANNUALLY : 'Annually',  

    longName(freq) {
        switch(freq) {
            case Frequency.WEEKLY:
                return 'Every Saturday';
            case Frequency.BIWEEKLY:
                return 'Every other Saturday';
            case Frequency.SEMI_MONTHLY:
                return '1st and 15th of the Month';
            case Frequency.MONTHLY:
                return '1st of the Month';
            case Frequency.QUARTERLY:
                return '1st of the Quarter';
            case Frequency.ANNUALLY:
                return '1st of the year';
            default:
                return freq;
        }
    }
}

class Account {
    id;
    name;
    bal = new Money();
    allowanceFrequency;
    allowance;
    nextAllowanceDate;
    interestFrequency;
    interest;
    nextInterestDate;

    numTxns = 0;
    txns=[]; // Array of Years, Array of Months, Array of Txns

    constructor (name) {
        this.name = name;
    }

    // Don't export txns
    toJSON(key) {
        var obj = {};
        for (var prop in this) {
            switch (prop) {
                case 'bal': 
                case 'numTxns':
                case 'txns':
                    // do nothing, we are skipping these :)
                    break;
                default:
                    obj[prop] = this[prop];
            }
        }
        return obj;
    }

    static saveAccount(account, accounts) {
        // isNew account
        if (!account.id) {
            account.id = accounts.reduce((start, x)=>{return x.id >= start ? x.id + 1 : start }, 1);
            accounts.push(account);
        }

        localStorage.setItem("accounts", JSON.stringify(accounts));
    }

    static createFromJSON( obj) {
        let account = new Account(obj.name);
        account.id = obj.id;
        return account;
    }

    static readAccounts () {
        var accounts;
        if (localStorage.hasOwnProperty('accounts')) {
            let value = localStorage.getItem('accounts');
            let list = JSON.parse(value);
            accounts = list.map((o) => {
                return Account.createFromJSON(o);
              });
        }
        return accounts ? accounts : [];
    }

    static findAccount(accounts, id) {
        return accounts.find((x)=>{return x.id === id;});
    }

    
}



export default Account;