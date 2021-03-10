export default class Quotation {
    constructor(id= null, cite = '', attends ='', attends_phone ='', installment ='', date ='', amount = 0, discount = 0, term = '', payment = '', validity = '', note = '', customer_id = null, user_id = null, office_id = null) {
        this.id = id;
        this.cite = cite;
        this.attends = attends;
        this.attends_phone = attends_phone;
        this.installment = installment;
        this.date = new Date().toISOString().slice(0,10);
        this.amount = amount;
        this.discount = discount;
        this.term = term;
        this.payment = payment;
        this.validity = validity;
        this.note = note;
        this.customer_id = customer_id;
        this.user_id = user_id;
        this.office_id = office_id;
    }
}