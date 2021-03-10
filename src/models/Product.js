export default class Product {
    constructor(code = '', name = '', description = '', material = '', quality = '', finish = '', dimension = 0, category_id = null) {
    	this.code = code;
        this.name = name;
        this.description = description;
        this.material = material;
        this.quality = quality;
        this.finish = finish;
        this.dimension = dimension;
        this.category_id = category_id;
    }
}