//ProductModalController
//Controller for the ProductModal.html partial
var ProductModalController = (function () {
    //Constructor
    //ModalInstance - Instance of the Modal. Not the same as $modal
    //Product - Product Instance from the injection loaded from the options
    function ProductModalController(modal, modalData) {
        this.modal = modal;
        this.product = modalData.product;
        this.vendors = modalData.vendors;
        if (this.product) {
            this.modalTitle = "Update Details for Product " + this.product.productcode;
            this.todo = "update";
        }
        else {
            this.modalTitle = "Add Details for new Product";
            this.todo = "add";
        }
        this.retVal = { operation: "", product: this.product, status: "" };
    }
    //Add - Send back new Product to the main controller to be added
    ProductModalController.prototype.add = function () {
        this.retVal.operation = "add";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    };
    //Update - Send updated Product back to the main controller to be updated
    ProductModalController.prototype.update = function () {
        this.retVal.operation = "update";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    };
    //Delete - Send product back to the main controller to be deleted
    ProductModalController.prototype.delete = function () {
        this.retVal.operation = "delete";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    };
    //Cancel - Discard any changes then back out
    ProductModalController.prototype.cancel = function () {
        this.retVal.operation = "cancel";
        if (this.product) {
            this.retVal.status = this.product.productcode + " not changed!";
        }
        else {
            //We were adding
            this.retVal.status = "No Product Entered!";
        }
        this.modal.close(this.retVal);
    };
    //Static Injection
    ProductModalController.$inject = ["$modalInstance", "modalData"]; //Modal Data is from the parent controller
    //Members
    ProductModalController.Id = "ProductModalController";
    return ProductModalController;
})();
//Add to the application
app.controller("ProductModalController", ProductModalController);
//# sourceMappingURL=product.modal.controller.js.map