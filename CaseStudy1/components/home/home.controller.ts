/**
 * HomeController
 * - controller for home.html partial
 */
class HomeController {
    label: string;
    subheading: string;

    constructor() {
        this.label = "Guardian's Light";
        this.subheading = "Best Supplier in the Cosmodrome";
    } 
}
app.controller("HomeController", [HomeController]);