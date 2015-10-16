/*
    REST Services
    - Service to process all REST calls for the application
    from GlassFish Server's JAX-RS resources
*/

class RESTService {
    //Static injection for Angular Services
    static $inject = ["$http", "$q"];

    //class members
    baseURL: string = "http://localhost:8080/APPOCase1/restapi/";

    /*
    Constructor - Values supplied by the static injection
    Http: Angular HTTP Service
    Location: Angular Q/Promise Services
    */

    constructor(public http: ng.IHttpService, public q: ng.IQService) { }


    public callServer(action: string, url?: string, id?: string, model?: any) {
        var defTask = this.q.defer();

        switch (action) {
            case "get":
                this.http.get(this.baseURL + url) //IHttp service call returns it's own promise
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("Server Error!"));
                break; //End of Get
            case "post":
                this.http.post(this.baseURL + url, model)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("Server Error"));
                break; //End of Post
            case "put":
                this.http.put(this.baseURL + url, model)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("Server Error!"));
                break; // End of Put
            case "delete":
                this.http.delete(this.baseURL + url + "/" + id)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("Server Error"));
                break; //End of Delete
        }

        return defTask.promise; //Return the promise to the service
    }
};

app.service("RESTService", RESTService);