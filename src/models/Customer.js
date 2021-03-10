export default class Customer {
    constructor(business_name = '', address = '', nit = '', phone = '', email = '', city_id = null) {
        this.business_name = business_name;
        this.address = address;
        this.nit = nit;
        this.phone = phone;
        this.email = email;
        this.city_id = city_id;
    }
}