//ProductController - Controller for the Product.html Partial

class ProductController {

    //Static Injection
    static $inject = ["RESTService", '$modal', '$filter'];

    //Members
    product: Product;
    products: Product[];
    vendors: Vendor[];
    status: string;
    selectedRow: string;

    //Construction
    constructor(public restsvc: RESTService,
        public modal: ng.ui.bootstrap.IModalService,
        public filter: ng.IFilterService) {
        this.loadProducts();
        this.loadVendors();
    }

    //Load Products - Call to the RestSVC to return promise containing all product information
    //                from the server
    public loadProducts(msg?: string) {
        return this.restsvc.callServer("get", "product")
            .then((response: Product[]) => {
                this.products = response;
                if (msg) {
                    this.status = msg + " - Products Retrieved";
                } else {
                    this.status = "Products Retrieved";
                }
            })
            .catch((error: any) => this.status = "Products no retrieved. Code: " + error);
    }

    //Load Vendors - Call to the RestSVC to return a promise containing all of the vendors from the server
    public loadVendors() {
        return this.restsvc.callServer("get", "vendor")
            .then((response: Vendor[]) => {
                this.vendors = response;
            })
            .catch((error: any) => this.status = "Couldn't retrieve vendors! Code: " + error);
    }


    //SelectRow - Function to determine the Product selected by the user.
    //            It will then pass the desired product onto the new modal
    //Row: Row to apply the selected style to
    //Product: Selected Product to pass to the modal
    public selectRow(row: string, product: Product) {
        this.selectedRow = row;
        //Set up the modal characteristics
        var md = { product: product, vendors: this.vendors };
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: "components/product/productModal.html",
            controller: ProductModalController.Id + " as ctrlr",
            resolve: {
                modalData: () => {
                    return md;
                }
            }
        };

        this.modal.open(options).result
            .then((results: any) => this.processModal(results))
            .catch((error: any) => this.status = error);
    } //Select Row

    //ProcessModal - Process Product information after the modal closes
    //Results - Results object containing info return from the modal
    processModal(results: any) {
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "product", results.product.productcode, results.product)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            //Means we have only updated 1 row based on response
                            msg = "Product " + results.product.productcode + " Updated!";
                            this.loadProducts(msg);
                        }
                    }) //End of Then
                    .catch((error: any) => this.status = "Product not updated! - " + error);
            case "cancel":
                this.loadProducts(results.status);
                this.selectedRow = "";
                break;
            case "delete":
                return this.restsvc.callServer("delete", "product", results.product.productcode)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Product " + results.product.productcode + " Deleted!";
                            this.loadProducts(msg);
                        }
                    })
                    .catch((error: any) => this.status = "Product not deleted! - " + error);
            case "add":
                return this.restsvc.callServer("post", "product", "", results.product)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Product " + results.product.productcode + " Added!";
                            this.loadProducts(msg);
                        }
                    })
                    .catch((error: any) => this.status = "Product not created! - " + error);
        }
    }


    //FindSelected - Function to sort the Product Array
    //Col - Which column to sort by
    //Order - Ascending or Descending Order
    findSelected(col: number, order: any) {
        this.products = this.filter("orderBy")(this.products, col, order);
        if (this.product) { //Have we selected a product at this point?
            for (var i = 0; i < this.products.length; ++i) {
                if (this.products[i].productcode === this.product.productcode) {
                    this.selectedRow = this.products[i].productcode;
                }
            }
        } //End of IF (Product)
    }
}

//Add the controller to the application
app.controller("ProductController", ProductController);