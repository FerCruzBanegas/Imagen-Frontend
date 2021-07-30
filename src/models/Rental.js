export default class Rental {
    constructor(date_start= '', date_end = '', observation ='', illumination ='', print ='', amount_monthly = 0, amount_total = 0, customer_id = null, billboard_id = null, user_id = null, rental_id = null, quotation_id = null) {
        this.date_start = date_start;
        this.date_end = date_end;
        this.observation = observation;
        this.illumination = illumination;
        this.print = print;
        this.amount_monthly = amount_monthly;
        this.amount_total = amount_total;
        this.customer_id = customer_id;
        this.billboard_id = billboard_id;
        this.user_id = user_id;
        this.rental_id = rental_id;
        this.quotation_id = quotation_id;
    }
}