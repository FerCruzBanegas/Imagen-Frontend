export default class Billboard {
    constructor(zone = '', location = '', dimension = '', price = 0, illumination = null, city_id = null, billboard_type_id = null) {
    	this.zone = zone;
        this.location = location;
        this.dimension = dimension;
        this.price = price;
        this.illumination = illumination;
        this.city_id = city_id;
        this.billboard_type_id = billboard_type_id
    }
}