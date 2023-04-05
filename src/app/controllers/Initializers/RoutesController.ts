import { Express, Request, Response, Router } from "express";
import { Controllers } from "../Controllers";
export class RoutesController {
    private Router: Express;
    private controllers: Controllers;
    constructor(router: Express, routes: Object, controllers: Controllers) {
        this.Router = router;
        this.controllers = controllers
        this.initRoutes(routes);
    }

    public listen(port: number) {
        this.Router.listen(port);
        console.log("Server started at: http://localhost:" + port)
    }

    private initRoutes(routes: Object) {
        Object.keys(routes).forEach((prefix) => {
            let path = routes[prefix]
            if (prefix == "ExpressConfig") {
                Object.keys(path).forEach((config) => {
                    path[config].forEach((element: any) => {
                        this.Router[config.toLowerCase()](element[0], element[1])
                    });
                })
            } else if (!Array.isArray(path) && typeof path === "object") {
                Object.keys(path).forEach(routeType => {
                    Object.keys(path[routeType]).forEach((route) => {
                        let tmp = path[routeType][route]
                        if (routeType == "redirect") {
                            this.Router[tmp[0].toLowerCase()]('/' + route, (req: Request, res: Response) => {
                                res.redirect(tmp[1])
                            });
                        } else {
                            if (this.controllers[tmp[0]] != undefined && this.controllers[tmp[0]][tmp[1]] != undefined) {
                                let pointer = ((tmp[2] == true) ? '' : '/' + prefix) + '/' + route
                                this.Router[routeType.toLowerCase()](
                                    pointer,
                                    (request: Request, response: Response) => {
                                        try {
                                            this.controllers[tmp[0]][tmp[1]](request, response)
                                        } catch (err: any) {
                                            console.error(err);
                                            response.sendStatus(500)
                                        }
                                    }
                                );
                            } else {
                                console.error("Route not found", tmp[0], tmp[1]);
                            }
                        }
                    })
                })
            } else if (Array.isArray(path)) {
                console.log(path)
                this.Router[path[0].toLowerCase()](path[1], (request: Request, response: Response) => path[2](request, response))
            }
        })
    }
}