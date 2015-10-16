//VendorModalController
//Controller for the vendormodal.html partial

class VendorModalController {
    //static injection
    static $inject = ["$modalInstance", "modalData"]; //ModalData is from the parent controller

    //Members
    static Id = "VendorModalController";
    modalTitle: string;
    retVal: any;
    todo: string;

    //Constructor
    //modalInstance : Instace of the modal - not the same as $modal
    //emp : Employee instance from the injection loaded from the options
    constructor(public modal: ng.ui.bootstrap.IModalServiceInstance, public vendor: Vendor) {
        if (vendor) {
            this.modalTitle = "Update Details for Vendor " + vendor.vendorno;
            this.todo = "Update";
        } else {
            this.modalTitle = "Add Details For New Vendor";
            this.todo = "Add";
        }

        this.retVal = { operation: "", retEmployee: vendor, status: "" };
    }

    //Add - Send new Employee back to the main controller to be added
    add() {
        this.retVal.operation = "add";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }

    //Update - Send updated Employee back to the main controller to be updated
    update() {
        this.retVal.operation = "update";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }

    //Delete - Send employee back to main controller to be deleted
    delete() {
        this.retVal.operation = "delete";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }


    //Cancel - discard any changes then back out to the main controller
    cancel() {
        this.retVal.operation = "cancel";
        if (this.vendor) {
            //We were updating
            this.retVal.status = this.vendor.name + " not changed!";
        } else {
            //We were adding
            this.retVal.status = "No Employee Entered!";
        }
        this.modal.close(this.retVal);
    }
}

app.controller("VendorModalController", VendorModalController);