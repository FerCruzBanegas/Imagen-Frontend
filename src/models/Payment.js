export default class Payment {
    constructor(date = '', type = '', path = {name: null, url: null}, amount = '0.00') {
        this.date = new Date().toISOString().slice(0,10);
        this.type = type;
        this.path = path;
        this.amount = amount;
    }
}