import { Request, Response } from "express";
import { Globals } from "./Globals";

export class NpmController {
    private globals: Globals;
    private controllers: any = {};
    constructor(globals: Globals) {
        this.globals = globals;

    }

    public async build(req: Request, res: Response): Promise<void> {
        let commands: Array<string> = [];
        let conf = this.globals.Config.git || false
        if(conf != false){
            if(Array.isArray(conf.path)){

            }else{
                commands.push("cd ".concat(req.params.path || conf.path))
            }
            commands.push("npm run build");
            this.globals.Controllers.ConsoleController.exec(commands.join(" && "),res)
        }else
            res.send({status:404,error:"No git configurations defined"})
    }
}