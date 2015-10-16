//ProductController - Controller for the Product.html Partial
var ProductController = (function () {
    //Construction
    function ProductController(restsvc, modal, filter) {
        this.restsvc = restsvc;
        this.modal = modal;
        this.filter = filter;
        this.loadProducts();
        this.loadVendors();
    }
    //Load Products - Call to the RestSVC to return promise containing all product information
    //                from the server
    ProductController.prototype.loadProducts = function (msg) {
        var _this = this;
        return this.restsvc.callServer("get", "product")
            .then(function (response) {
            _this.products = response;
            if (msg) {
                _this.status = msg + " - Products Retrieved";
            }
            else {
                _this.status = "Products Retrieved";
            }
        })
            .catch(function (error) { return _this.status = "Products no retrieved. Code: " + error; });
    };
    //Load Vendors - Call to the RestSVC to return a promise containing all of the vendors from the server
    ProductController.prototype.loadVendors = function () {
        var _this = this;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
        })
            .catch(function (error) { return _this.status = "Couldn't retrieve vendors! Code: " + error; });
    };
    //SelectRow - Function to determine the Product selected by the user.
    //            It will then pass the desired product onto the new modal
    //Row: Row to apply the selected style to
    //Product: Selected Product to pass to the modal
    ProductController.prototype.selectRow = function (row, product) {
        var _this = this;
        this.selectedRow = row;
        //Set up the modal characteristics
        var md = { product: product, vendors: this.vendors };
        var options = {
            templateUrl: "components/product/productModal.html",
            controller: ProductModalController.Id + " as ctrlr",
            resolve: {
                modalData: function () {
                    return md;
                }
            }
        };
        this.modal.open(options).result
            .then(function (results) { return _this.processModal(results); })
            .catch(function (error) { return _this.status = error; });
    }; //Select Row
    //ProcessModal - Process Product information after the modal closes
    //Results - Results object containing info return from the modal
    ProductController.prototype.processModal = function (results) {
        var _this = this;
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "product", results.product.productcode, results.product)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        //Means we have only updated 1 row based on response
                        msg = "Product " + results.product.productcode + " Updated!";
                        _this.loadProducts(msg);
                    }
                }) //End of Then
                    .catch(function (error) { return _this.status = "Product not updated! - " + error; });
            case "cancel":
                this.loadProducts(results.status);
                this.selectedRow = "";
                break;
            case "delete":
                return this.restsvc.callServer("delete", "product", results.product.productcode)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Product " + results.product.productcode + " Deleted!";
                        _this.loadProducts(msg);
                    }
                })
                    .catch(function (error) { return _this.status = "Product not deleted! - " + error; });
            case "add":
                return this.restsvc.callServer("post", "product", "", results.product)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Product " + results.product.productcode + " Added!";
                        _this.loadProducts(msg);
                    }
                })
                    .catch(function (error) { return _this.status = "Product not created! - " + error; });
        }
    };
    //FindSelected - Function to sort the Product Array
    //Col - Which column to sort by
    //Order - Ascending or Descending Order
    ProductController.prototype.findSelected = function (col, order) {
        this.products = this.filter("orderBy")(this.products, col, order);
        if (this.product) {
            for (var i = 0; i < this.products.length; ++i) {
                if (this.products[i].productcode === this.product.productcode) {
                    this.selectedRow = this.products[i].productcode;
                }
            }
        } //End of IF (Product)
    };
    //Static Injection
    ProductController.$inject = ["RESTService", '$modal', '$filter'];
    return ProductController;
})();
//Add the controller to the application
app.controller("ProductController", ProductController);
//# sourceMappingURL=product.controller.js.map