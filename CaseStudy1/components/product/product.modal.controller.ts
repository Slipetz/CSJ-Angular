//ProductModalController
//Controller for the ProductModal.html partial

class ProductModalController {
    //Static Injection
    static $inject = ["$modalInstance", "modalData"]; //Modal Data is from the parent controller

    //Members
    static Id = "ProductModalController";
    modalTitle: string;
    retVal: any;
    todo: string;
    product: Product;
    vendors: Vendor[];

    //Constructor
    //ModalInstance - Instance of the Modal. Not the same as $modal
    //Product - Product Instance from the injection loaded from the options
    constructor(public modal: ng.ui.bootstrap.IModalServiceInstance, modalData: ProductModalData) {
        this.product = modalData.product;
        this.vendors = modalData.vendors;

        if (this.product) {
            this.modalTitle = "Update Details for Product " + this.product.productcode;
            this.todo = "update";
        } else {
            this.modalTitle = "Add Details for new Product";
            this.todo = "add";
        }

        this.retVal = { operation: "", product: this.product, status: "" };
    }

    //Add - Send back new Product to the main controller to be added
    add() {
        this.retVal.operation = "add";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }

    //Update - Send updated Product back to the main controller to be updated
    update() {
        this.retVal.operation = "update";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }

    //Delete - Send product back to the main controller to be deleted
    delete() {
        this.retVal.operation = "delete";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }

    //Cancel - Discard any changes then back out
    cancel() {
        this.retVal.operation = "cancel";
        if (this.product) {
            this.retVal.status = this.product.productcode + " not changed!";
        } else {
            //We were adding
            this.retVal.status = "No Product Entered!";
        }
        this.modal.close(this.retVal);
    }
}

//Add to the application
app.controller("ProductModalController", ProductModalController);