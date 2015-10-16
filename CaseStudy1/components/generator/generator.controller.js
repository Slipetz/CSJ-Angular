//GeneratorController - Class for generating PO's based on vendor and item
var GeneratorController = (function () {
    function GeneratorController(restsvc, windowsvc) {
        this.restsvc = restsvc;
        this.windowsvc = windowsvc;
        this.loadVendors();
        this.loadProducts();
    }
    GeneratorController.prototype.loadProducts = function () {
        var _this = this;
        return this.restsvc.callServer("get", "product")
            .then(function (response) {
            _this.poCart = new Array(response.length);
            for (var i = 0; i < response.length; ++i) {
                var tempProduct = response[i];
                _this.poCart[i] = {
                    productcode: tempProduct.productcode,
                    productname: tempProduct.productname,
                    price: tempProduct.costprice,
                    ext: 0.00,
                    qty: 0
                };
            }
        })
            .catch(function (error) { return _this.status = "Couldn't retrieve all products! Error: " + error; });
    };
    GeneratorController.prototype.loadVendors = function () {
        var _this = this;
        this.pickedVendor = false;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
            _this.status = "Vendors Retrieved!";
            _this.quantity = "EOQ";
        })
            .catch(function (error) { return _this.status = "Couldn't retrieve vendors! Code: " + error; });
    };
    GeneratorController.prototype.getProducts = function (showMsg) {
        var _this = this;
        if (showMsg === void 0) { showMsg = true; }
        this.clearCart();
        return this.restsvc.callServer("get", "product/" + this.vendor.vendorno)
            .then(function (response) {
            _this.products = response;
            if (response.length === 0) {
                if (showMsg)
                    _this.status = "No items!";
            }
            else {
                if (showMsg)
                    _this.status = "Products Retrieved!";
                _this.pickedVendor = true;
            }
        })
            .catch(function (error) { return _this.status = "Couldn't retrieve products for vendor: " + _this.vendor.vendorno + ". Error: " + error; });
    };
    GeneratorController.prototype.addItem = function () {
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;
        for (var i = 0; i < this.poCart.length; ++i) {
            if (this.poCart[i].productcode === this.product.productcode) {
                if (this.quantity !== "EOQ") {
                    this.poCart[i].qty = this.quantity;
                    this.poCart[i].ext = this.quantity * this.poCart[i].price;
                }
                else {
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
        }
        else {
            this.status = "No items in the cart!";
        }
    };
    GeneratorController.prototype.clearCart = function () {
        for (var i = 0; i < this.poCart.length; ++i) {
            this.poCart[i].qty = 0;
            this.poCart[i].ext = 0;
        }
        this.cartHasItem = false;
        this.quantity = "EOQ";
    };
    GeneratorController.prototype.createPO = function () {
        var _this = this;
        this.status = "Wait...";
        var PODTO = {
            vendorno: this.vendor.vendorno,
            ponumber: "0",
            items: this.poCart,
            total: this.total,
            date: undefined
        };
        return this.restsvc.callServer("post", "po", "", PODTO)
            .then(function (generatedPoNumber) {
            _this.getProducts(false);
            if (generatedPoNumber > 0) {
                _this.clearCart();
                _this.status = "PO " + generatedPoNumber + " Created!";
                _this.poGenerated = true;
                _this.poNumber = generatedPoNumber;
            }
            else {
                _this.clearCart();
                _this.status = "Problem generating PO, contact purchasing";
            }
        })
            .catch(function (error) { return _this.status = "PO not created - " + error; });
    }; //CreatePO End
    //ViewPDF - Determine PO Number and pass to server side servlet to get PDF
    GeneratorController.prototype.viewPdf = function () {
        this.windowsvc.location.href = "http://localhost:8080/APPOCase1/POPDF?po=" + this.poNumber;
    };
    //Static Injection
    GeneratorController.$inject = ["RESTService", "$window"];
    return GeneratorController;
})();
app.controller("GeneratorController", GeneratorController);
//# sourceMappingURL=generator.controller.js.map