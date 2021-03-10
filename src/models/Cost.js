export default class Cost {
    constructor(tool= 0, admin_expense = 0, utility = 0, tax = 0, total_amount = 0, price_without_tax = 0, price_with_tax = 0, normal_price = 0, volume_price = 0, product_id = null, office_id = null) {
        this.tool = tool;
        this.admin_expense = admin_expense;
        this.utility = utility;
        this.tax = tax;
        this.total_amount = total_amount;
        this.price_without_tax = price_without_tax;
        this.price_with_tax = price_with_tax;
        this.normal_price = normal_price;
        this.volume_price = volume_price;
        this.product_id = product_id;
        this.office_id = office_id;
    }
}