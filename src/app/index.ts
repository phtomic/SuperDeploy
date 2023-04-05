"use strict";
import { ExpressController } from "./controllers/Initializers/ExpressController";
import { RoutesController } from "./controllers/Initializers/RoutesController";
import { Routes } from "./config/routes";
import { NetworkConfig } from "./config/network";
import { Globals } from "./controllers/Globals";

export class App {
    private routes: Routes;
    private networkConfig: NetworkConfig;
    private globals: Globals;
    constructor() {
        this.globals = new Globals();
        this.routes = new Routes();
        this.networkConfig = new NetworkConfig();
        this.initialize();
    }
    private initialize() {
        this.routes.starts.forEach((route) => {
            if (this.networkConfig[route.toLowerCase()])
                this.startServer(route);
        })
    }

    private startServer(pointer: string) {

        let route = this.routes[pointer.toLowerCase()];
        let config = this.networkConfig[pointer.toLowerCase()];
        let auth = config.auth
        if (route != undefined) {
            let controller = new ExpressController(config.port, auth, this.globals)
            let router = new RoutesController(controller.getRouter(), route, this.globals.Controllers)
            router.listen(config.port);
        } else {
            console.debug("No routes configured for " + pointer)
        }
    }
}