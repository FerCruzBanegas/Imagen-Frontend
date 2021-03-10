export default class Money {
    constructor(decimal = '.', thousands = ',', prefix = '', suffix = '', precision = 2, masked =false) {
        this.decimal = decimal;
        this.thousands = thousands;
        this.prefix = prefix;
        this.suffix = suffix;
        this.precision = precision;
        this.masked = masked;
    }
}