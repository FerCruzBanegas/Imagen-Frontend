export default class Employee {
    constructor(name = '', document = '', num_document = '', address = '', phone = '', email = '', office_id = null) {
        this.name = name;
        this.document = document;
        this.num_document = num_document;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.office_id = office_id;
    }
}