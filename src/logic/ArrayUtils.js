/**
 * https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
 * Represents a search through an array.
 * @function search
 * @param {Array} array - The array you wanna search through
 * @param {string} key - The key to search for
 * @param {string} [prop] - The property name to find it in
 */
export const search = (array, key, prop) => {
    // Optional, but fallback to key['name'] if not selected
    prop = typeof prop === 'undefined' ? 'id' : prop;

    for (var i = 0; i < array.length; i++) {
        if (array[i][prop] === key) {
            return array[i];
        }
    }
    return null;
}

export const remove = (array, obj) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}

export const replace = (array, oldObj, newObj) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === oldObj) {
            array[i] = newObj;
            return true;
        }
    }
    return false;
}

/**
 * Return a new object with a shallow copy of all of inObj's properites except thos in excludedProps
 * @param {Object} inObj 
 * @param {[String]} excludedProps 
 */
export const copyObjExcept = (inObj, excludedProps)  => {
    // returns true if prop is not in the excludedProps list
    let notExcluded = (prop)=> {
        return !excludedProps.find((val)=>{return val===prop});
    };
    // add the inObj's prop to the accumulator object
    let copyProp= (newObj, prop) => {
        newObj[prop] = inObj[prop];
        return newObj;
    };
    // Copy only the properites that aren't in the exluded list to a new object
    let newObj = Object.keys(this).filter(notExcluded).reduce(copyProp, {});
    return newObj;
}

/**
 * return the largest value of the array
 * @function maxValue 
 * @param {Array} array - the array you wanna search through
 * @param {string} prop - the proptery name to max
 */
export const maxValue = (array, prop, defaultVal) => {
     let ret = Math.max.apply(Math, array.map((o) => {return o[prop]}));
     if ((!ret || ret === Number.NEGATIVE_INFINITY)) {
         return defaultVal
     }
     return ret;
}