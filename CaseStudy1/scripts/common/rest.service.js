/*
    REST Services
    - Service to process all REST calls for the application
    from GlassFish Server's JAX-RS resources
*/
var RESTService = (function () {
    /*
    Constructor - Values supplied by the static injection
    Http: Angular HTTP Service
    Location: Angular Q/Promise Services
    */
    function RESTService(http, q) {
        this.http = http;
        this.q = q;
        //class members
        this.baseURL = "http://localhost:8080/APPOCase1/restapi/";
    }
    RESTService.prototype.callServer = function (action, url, id, model) {
        var defTask = this.q.defer();
        switch (action) {
            case "get":
                this.http.get(this.baseURL + url) //IHttp service call returns it's own promise
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("Server Error!"); });
                break; //End of Get
            case "post":
                this.http.post(this.baseURL + url, model)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("Server Error"); });
                break; //End of Post
            case "put":
                this.http.put(this.baseURL + url, model)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("Server Error!"); });
                break; // End of Put
            case "delete":
                this.http.delete(this.baseURL + url + "/" + id)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("Server Error"); });
                break; //End of Delete
        }
        return defTask.promise; //Return the promise to the service
    };
    //Static injection for Angular Services
    RESTService.$inject = ["$http", "$q"];
    return RESTService;
})();
;
app.service("RESTService", RESTService);
//# sourceMappingURL=rest.service.js.map