export default class Payment {
    constructor(date = '', type = '', op = '', number = '', path = {name: null, url: null}, amount = '0.00') {
        this.date = new Date().toISOString().slice(0,10);
        this.type = type;
        this.op = op;
        this.number;
        this.path = path;
        this.amount = amount;
    }
}