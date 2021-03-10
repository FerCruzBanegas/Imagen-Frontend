export default class User {
    constructor(name = '', forename = '', surname = '', email = '', phone='', password_current, password = '', password_confirmation = '' , state = null, office_id = null, profile_id = null) {
        this.name = name;
        this.forename = forename;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.password_current = password_current;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.state = state;
        this.office_id = office_id;
        this.profile_id = profile_id;
    }
}