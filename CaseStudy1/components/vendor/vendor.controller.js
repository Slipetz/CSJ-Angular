//VendorController - Controller for the Vendor.html partial
var VendorController = (function () {
    //Construction 
    //RestSVC - application service for processing all rest calls
    //Modal - Angular UI Modal Service
    //Filter - Filter service for sorting columns asc/desc
    function VendorController(restsvc, modal, filter) {
        this.restsvc = restsvc;
        this.modal = modal;
        this.filter = filter;
        this.loadVendors();
    }
    //Load Vendors - Called from constructor to call resvc to return
    //                 promise containing all vendors information from server
    VendorController.prototype.loadVendors = function (msg) {
        var _this = this;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
            if (msg) {
                _this.status = msg + " - Vendors Retrieved";
            }
            else {
                _this.status = "Vendors Retrieved";
            }
        })
            .catch(function (error) { return _this.status = "Vendors not retrieved. Code: " + error; });
    };
    //SelectRow - Function to determine the vendor selected by the user.
    //            It will then pass the desired vendor onto the new modal
    //Row: Row to apply the selected row style
    //Vendor: Selected Vendor to pass to the modal
    VendorController.prototype.selectRow = function (row, vendor) {
        var _this = this;
        this.selectedRow = row;
        //Set up the modals characteristics
        var options = {
            templateUrl: "components/vendor/vendorModal.html",
            controller: VendorModalController.Id + " as ctrlr",
            resolve: {
                modalData: function () {
                    return vendor; //Data for Injection
                }
            }
        };
        //Popup the modal
        this.modal.open(options).result
            .then(function (results) { return _this.processModal(results); })
            .catch(function (error) { return _this.status = error; });
    }; //Select Row
    //ProcessModal - Process vendor information after the modal closes
    //Results - Results object containing info returned from the modal
    VendorController.prototype.processModal = function (results) {
        var _this = this;
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "vendor", results.vendor.vendorno, results.vendor)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        //Means we have only updated 1 row based on the response
                        msg = "Vendor " + results.vendor.vendorno + " Updated!";
                        _this.loadVendors(msg);
                    }
                }) //End of Then
                    .catch(function (error) { return _this.status = "Vendor not updated! - " + error; });
            case "cancel":
                this.loadVendors(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "vendor", results.vendor.vendorno)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Vendor " + results.vendor.vendorno + " Deleted!";
                        _this.loadVendors(msg);
                    }
                }) //End of Then
                    .catch(function (error) { return _this.status = "Vendor not deleted! - " + error; });
            case "add":
                return this.restsvc.callServer("post", "vendor", "", results.vendor)
                    .then(function (response) {
                    msg = "Vendor " + response + " has been created!";
                    _this.loadVendors(msg);
                }) //End of Then
                    .catch(function (error) { return _this.status = "Vendor not created! - " + error; });
        }
    };
    //FindSelected - Function to sort Vendors array
    //Col - Which column we are sorting
    //Order - Ascending or Descending order
    VendorController.prototype.findSelected = function (col, order) {
        this.vendors = this.filter("orderBy")(this.vendors, col, order);
        if (this.vendor) {
            for (var i = 0; i < this.vendors.length; ++i) {
                if (this.vendors[i].vendorno === this.vendor.vendorno) {
                    this.selectedRow = i;
                }
            }
        } //End of If (Vendor)
    };
    //static injection
    VendorController.$inject = ["RESTService", '$modal', '$filter'];
    return VendorController;
})();
//Add the controller to the application
app.controller("VendorController", VendorController);
//# sourceMappingURL=vendor.controller.js.map