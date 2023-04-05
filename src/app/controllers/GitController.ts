import { Request, Response } from "express";
import { Globals } from "./Globals";

export class GitController {
    private globals: Globals;
    private controllers: any = {};
    constructor(globals: Globals) {
        this.globals = globals;

    }

    public async pull(req: Request, res: Response): Promise<void> {
        let commands: Array<string> = [];
        let conf = this.globals.Config.git || false
        if(conf != false){
            commands.push("cd ".concat(req.params.path || conf.path))
            commands.push("git pull");
            this.globals.Controllers.ConsoleController.exec(commands.join(" && "),res)
        }else
            res.send({status:404,error:"No git configurations defined"})
    }
}