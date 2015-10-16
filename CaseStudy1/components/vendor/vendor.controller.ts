//VendorController - Controller for the Vendor.html partial

class VendorController {
    //static injection
    static $inject = ["RESTService", '$modal', '$filter'];

    //members
    vendors: Vendor[];
    status: string;
    selectedRow: number;
    vendor: Vendor;


    //Construction 
    //RestSVC - application service for processing all rest calls
    //Modal - Angular UI Modal Service
    //Filter - Filter service for sorting columns asc/desc
    constructor(public restsvc: RESTService,
        public modal: ng.ui.bootstrap.IModalService,
        public filter: ng.IFilterService) {
        this.loadVendors();
    }

    //Load Vendors - Called from constructor to call resvc to return
    //                 promise containing all vendors information from server
    public loadVendors(msg?: string) {
        return this.restsvc.callServer("get", "vendor")
            .then((response: Vendor[]) => {
                this.vendors = response;
                if (msg) {
                    this.status = msg + " - Vendors Retrieved";
                } else {
                    this.status = "Vendors Retrieved";
                }
            })
            .catch((error: any) => this.status = "Vendors not retrieved. Code: " + error);
    }

    //SelectRow - Function to determine the vendor selected by the user.
    //            It will then pass the desired vendor onto the new modal
    //Row: Row to apply the selected row style
    //Vendor: Selected Vendor to pass to the modal
    public selectRow(row: number, vendor: Vendor) {
        this.selectedRow = row;
        //Set up the modals characteristics
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: "components/vendor/vendorModal.html",
            controller: VendorModalController.Id + " as ctrlr",
            resolve: {
                modalData: () => {
                    return vendor; //Data for Injection
                }
            }
        };

        //Popup the modal
        this.modal.open(options).result
            .then((results: any) => this.processModal(results))
            .catch((error: any) => this.status = error);
    } //Select Row

    //ProcessModal - Process vendor information after the modal closes
    //Results - Results object containing info returned from the modal
    processModal(results: any) {
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "vendor", results.vendor.vendorno, results.vendor)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            //Means we have only updated 1 row based on the response
                            msg = "Vendor " + results.vendor.vendorno + " Updated!";
                            this.loadVendors(msg);
                        }
                    }) //End of Then
                    .catch((error: any) => this.status = "Vendor not updated! - " + error);
            case "cancel":
                this.loadVendors(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "vendor", results.vendor.vendorno)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Vendor " + results.vendor.vendorno + " Deleted!";
                            this.loadVendors(msg);
                        }
                    }) //End of Then
                    .catch((error: any) => this.status = "Vendor not deleted! - " + error);
            case "add":
                return this.restsvc.callServer("post", "vendor", "", results.vendor)
                    .then((response: any) => {
                        msg = "Vendor " + response + " has been created!";
                        this.loadVendors(msg);
                    }) //End of Then
                    .catch((error: any) => this.status = "Vendor not created! - " + error);
        }
    }

    //FindSelected - Function to sort Vendors array
    //Col - Which column we are sorting
    //Order - Ascending or Descending order
    findSelected(col: number, order: any) {
        this.vendors = this.filter("orderBy")(this.vendors, col, order);
        if (this.vendor) { //Have we selected an Vendor at this point?
            for (var i = 0; i < this.vendors.length; ++i) {
                if (this.vendors[i].vendorno === this.vendor.vendorno) {
                    this.selectedRow = i;
                }
            }
        }//End of If (Vendor)
    }
}

//Add the controller to the application
app.controller("VendorController", VendorController);