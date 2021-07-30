export default class Campaign {
    constructor(name = '', date_start = '', date_end = '', note = '', rental_id = null) {
        this.name = name;
        this.date_start = date_start;
        this.date_end = date_end;
        this.note = note;
        this.rental_id = rental_id;
    }
}