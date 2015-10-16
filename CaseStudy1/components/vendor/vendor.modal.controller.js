//VendorModalController
//Controller for the vendormodal.html partial
var VendorModalController = (function () {
    //Constructor
    //modalInstance : Instace of the modal - not the same as $modal
    //emp : Employee instance from the injection loaded from the options
    function VendorModalController(modal, vendor) {
        this.modal = modal;
        this.vendor = vendor;
        if (vendor) {
            this.modalTitle = "Update Details for Vendor " + vendor.vendorno;
            this.todo = "Update";
        }
        else {
            this.modalTitle = "Add Details For New Vendor";
            this.todo = "Add";
        }
        this.retVal = { operation: "", retEmployee: vendor, status: "" };
    }
    //Add - Send new Employee back to the main controller to be added
    VendorModalController.prototype.add = function () {
        this.retVal.operation = "add";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    };
    //Update - Send updated Employee back to the main controller to be updated
    VendorModalController.prototype.update = function () {
        this.retVal.operation = "update";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    };
    //Delete - Send employee back to main controller to be deleted
    VendorModalController.prototype.delete = function () {
        this.retVal.operation = "delete";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    };
    //Cancel - discard any changes then back out to the main controller
    VendorModalController.prototype.cancel = function () {
        this.retVal.operation = "cancel";
        if (this.vendor) {
            //We were updating
            this.retVal.status = this.vendor.name + " not changed!";
        }
        else {
            //We were adding
            this.retVal.status = "No Employee Entered!";
        }
        this.modal.close(this.retVal);
    };
    //static injection
    VendorModalController.$inject = ["$modalInstance", "modalData"]; //ModalData is from the parent controller
    //Members
    VendorModalController.Id = "VendorModalController";
    return VendorModalController;
})();
app.controller("VendorModalController", VendorModalController);
//# sourceMappingURL=vendor.modal.controller.js.map