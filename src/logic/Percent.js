class Percent {
    value = 0; // value as positive percent
    error = '';

    constructor (initVal) {
        if (initVal) {
            if (initVal instanceof Percent) {
                this.value = initVal.value;
            } else if (initVal instanceof Money) {
                this.value = initVal.value * 100;
            } else if (typeof initVal === 'string') {
                initVal = initVal.replace("%", '');
                try {
                    this.value = parseFloat(initVal);
                } catch (e) {
                    console.log(initVal + " can't be parsed by parseFloat");
                }
            } else if (typeof initVal === 'number') {
                this.value = initVal;
            } else {
                this.error = 'Please enter a valid percent';
                console.log(initVal + " is not a Percent, Money, string or number so using 0 " + (typeof initval));
            }
        }
    }

    prettyString() {
        return this.asString() + "%";
    }

    asString() {
        return this.value + '';
    }

    toJSON(key) {
        if (key) {
            return this.value;
        } else {
            return this;
        }
    }
}

export default Percent;