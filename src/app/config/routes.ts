"use strict";
import express from "express";
export class Routes {
    public starts: Array<string> = ["Api"]
    public qrEndpoint = ""
    public api?: Object;
    public redirects?: Object;
    constructor() {
        this.api = {
            //"": ["GET" ,"Admin.index"],
            cli: {
                GET: {
                    "git/pull": ["GitController" ,"pull"],
                    "npm/build": ["NpmController" ,"build"],
                },
                POST: {
                    
                },
            },
        };
    }
}
