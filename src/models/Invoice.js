export default class Invoice {
    constructor(date = '', total = 0, nit_name = '', nit = '', title = '', footer = '', details = '', customer_id = null, user_id = null, quotation_id = null) {
        this.date = new Date().toISOString().slice(0,10);
        this.total = total;
        this.nit_name = nit_name;
        this.nit = nit;
        this.title = title;
        this.footer = footer;
        // this.oc = oc;
        // this.hea = hea;
        this.details = details
        this.customer_id = customer_id;
        this.user_id = user_id;
        this.quotation_id = quotation_id;
    }
}