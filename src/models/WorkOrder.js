export default class WorkOrder {
    constructor(opening_date = '', estimated_date = '', closing_date = '', type_work = '', note = '', name_staff = '', address_work = '', quotation_id = null, employees = [], city_id = null) {
        this.opening_date = opening_date;
        this.estimated_date = estimated_date;
        this.closing_date = closing_date;
        this.type_work = type_work;
        this.note = note;
        this.name_staff = name_staff;
        this.address_work = address_work;
        this.quotation_id = quotation_id;
        this.employees = employees;
        this.city_id = city_id;
    }
}