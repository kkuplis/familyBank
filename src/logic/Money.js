class Money {
    value = 0; // value as positive or negative integer cents
    error = '';

    constructor (initVal) {
        if (initVal) {
            if (initVal instanceof Money) {
                this.value = initVal.value;
            } else if (typeof initVal === 'string') {
                initVal = initVal.replace("$", '');
                try {
                    this.value = parseFloat(initVal);
                } catch (e) {
                    console.log(initVal + " can't be parsed by parseFloat");
                }
            } else if (typeof initVal === 'number') {
                this.value = initVal;
            } else {
                this.error = 'Please enter a valid amount';
                console.log(initVal + " is not a Money, string or number so using 0 " + (typeof initval));
            }
        }
    }
    
    abs() { 
        return new Money(Math.abs(this.value));
    }

    sign() { return this.value < 0 ? "-" : '';}

    color() {
        return this.value < 0 ? 'red' : 'black';
    }

    prettyString() {
        return this.sign() + "$" + this.asString();
    }

    asString() {
        let posValue = Math.abs(this.value);
        let cents = Math.round(posValue * 100);
        let dollars = Math.floor(cents / 100);
        cents = cents % 100;
        let s =  "";  // Add comma's every 3 digits :)
        while (dollars > 1000) {
            s = "," + dollars % 1000;
            dollars = dollars / 1000;
        }
        s = dollars + s;
        s += '.';
        if (cents >= 10) {
            s += cents;
        } else {
            s += '0' + cents;
        }
        return s;
    }

    toJSON(key) {
        if (key) {
            return this.value;
        } else {
            return this;
        }
    }
}

export default Money;