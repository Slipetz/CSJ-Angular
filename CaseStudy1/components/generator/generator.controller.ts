//GeneratorController - Class for generating PO's based on vendor and item

class GeneratorController {

    //Static Injection
    static $inject = ["RESTService", "$window"];

    //DataMembers
    vendors: Vendor[];
    vendor: Vendor;
    product: Product;
    products: Product[];
    status: string;
    quantity: any;
    subtotal: number;
    tax: number;
    total: number;
    poGenerated: boolean;
    poNumber: number;
    pickedVendor: boolean;
    cartHasItem: boolean;
    poCart: GeneratorItem[];

    constructor(public restsvc: RESTService, public windowsvc: ng.IWindowService) {
        this.loadVendors();
        this.loadProducts();
    }

    public loadProducts() {
        return this.restsvc.callServer("get", "product")
            .then((response: Product[]) => {
                this.poCart = new Array(response.length);
                for (var i = 0; i < response.length; ++i) {
                    var tempProduct = response[i];
                    this.poCart[i] = {
                        productcode: tempProduct.productcode,
                        productname: tempProduct.productname,
                        price: tempProduct.costprice,
                        ext: 0.00,
                        qty: 0
                    };
                }
            })
            .catch((error: any) => this.status = "Couldn't retrieve all products! Error: " + error);
    }

    public loadVendors() {
        this.pickedVendor = false;
        return this.restsvc.callServer("get", "vendor")
            .then((response: Vendor[]) => {
                this.vendors = response;
                this.status = "Vendors Retrieved!";
                this.quantity = "EOQ";
            })
            .catch((error: any) => this.status = "Couldn't retrieve vendors! Code: " + error);
    }

    public getProducts(showMsg: boolean = true) {
        this.clearCart();
        return this.restsvc.callServer("get", "product/" + this.vendor.vendorno)
            .then((response: Product[]) => {
                this.products = response;
                if (response.length === 0) {
                    if (showMsg)
                        this.status = "No items!";
                }
                else {
                    if (showMsg)
                        this.status = "Products Retrieved!";
                    this.pickedVendor = true;
                }
            })
            .catch((error: any) => this.status = "Couldn't retrieve products for vendor: " + this.vendor.vendorno + ". Error: " + error);
    }

    public addItem() {
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;

        for (var i = 0; i < this.poCart.length; ++i) {
            if (this.poCart[i].productcode === this.product.productcode) {
                if (this.quantity !== "EOQ") {
                    this.poCart[i].qty = this.quantity;
                    this.poCart[i].ext = this.quantity * this.poCart[i].price;
                } else {
                    this.poCart[i].qty = this.product.eoq;
                    this.poCart[i].ext = this.product.eoq * this.poCart[i].price;
                }

                this.status = "Item Added!";
            }

            this.subtotal += this.poCart[i].ext;
        }

        this.cartHasItem = this.subtotal !== 0;

        if (this.cartHasItem) {
            this.tax = this.subtotal * 0.13;
            this.total = this.subtotal + this.tax;
        } else {
            this.status = "No items in the cart!";
        }
    }

    public clearCart() {
        for (var i = 0; i < this.poCart.length; ++i) {
            this.poCart[i].qty = 0;
            this.poCart[i].ext = 0;
        }
        this.cartHasItem = false;
        this.quantity = "EOQ";
    }

    public createPO() {
        this.status = "Wait...";
        var PODTO = {
            vendorno: this.vendor.vendorno,
            ponumber: "0",
            items: this.poCart,
            total: this.total,
            date: undefined
        };

        return this.restsvc.callServer("post", "po", "", PODTO)
            .then((generatedPoNumber: number) => {
                this.getProducts(false);
                if (generatedPoNumber > 0) {
                    this.clearCart();
                    this.status = "PO " + generatedPoNumber + " Created!";
                    this.poGenerated = true;
                    this.poNumber = generatedPoNumber;
                } else {
                    this.clearCart();
                    this.status = "Problem generating PO, contact purchasing";
                }
            })
            .catch((error: any) => this.status = "PO not created - " + error);
    } //CreatePO End

    //ViewPDF - Determine PO Number and pass to server side servlet to get PDF
    public viewPdf() {
        this.windowsvc.location.href = "http://localhost:8080/APPOCase1/POPDF?po=" + this.poNumber;
    }
}

app.controller("GeneratorController", GeneratorController);