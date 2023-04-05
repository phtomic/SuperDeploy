import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express, Router, Request, Response, NextFunction } from 'express'
import path from 'path';
import { Globals } from '../Globals';
export class ExpressController {
    private app: Express;
    private needAuth: boolean = true;
    private global: Globals;
    private port: number;
    constructor(port: number, needAuth: boolean = true, global: Globals) {
        this.app = express();
        this.global = global;
        this.needAuth = needAuth;
        this.port = port;
        this.config();
    }

    private config() {
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Credentials', "true");
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            res.locals.data = req.cookies.data;
            res.locals.err = req.cookies.error;
            res.cookie('error', undefined, { maxAge: 0, httpOnly: true })
            res.cookie('data', undefined, { maxAge: 0, httpOnly: true })
            res.locals.user = req.cookies.connection;
            res.locals.validate = this.global.validate
            if (this.needAuth) {
                this.auth(req, res).then((ret: any) => {
                    req = ret.req
                    res = ret.res
                    next()
                });
            } else {
                next()
            }
        })
    }
    public getRouter(): Express {
        return this.app;
    }
    private async auth(req: Request, res: Response): Promise<any> {
        if (req.headers.authorization) {
            let auth = req.headers.authorization.replace("Bearer ","")
            let result = this.global.Config.auth.includes(auth)
            if(result){
                return { req: req, res: res };
            }else{
                res.sendStatus(401);
                return { req: req, res: res };
            }
        } else {
            res.sendStatus(401);
            return { req: req, res: res };
        }
    }
}