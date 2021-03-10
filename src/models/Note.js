export default class Note {
    constructor(date = '', total = 0, discount = 0, nit = '', voucher_id = null, customer_id = null, user_id = null, quotation_id = null) {
        this.date = new Date().toISOString().slice(0,10);
        this.total = total;
        this.discount = discount;
        this.nit = nit;
        this.voucher_id = voucher_id;
        this.customer_id = customer_id;
        this.user_id = user_id;
        this.quotation_id = quotation_id;
    }
}