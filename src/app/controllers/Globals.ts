import { Controllers } from "./Controllers";
import { Schenduler } from "./Schenduler";
import { Md5 } from "ts-md5";
import { LogsController } from "./Logs";
import * as fs from "fs";
export class Globals {
    public Controllers: Controllers;
    public Logs: LogsController;
    public Config: any = {
        DhcpTimeout: 5000,
        leaseTimeout: 5000,
        ...JSON.parse(fs.readFileSync("config.json","utf-8"))
    }
    public Crypt: any = {
        md5: Md5
    }
    constructor() {
        this.Logs = new LogsController();
        this.Controllers = new Controllers(this);
        new Schenduler(this.Controllers);
    }
    public validate(object: any, check: any, sub?: any): any {
        let valid: boolean = true;
        let messages: Array<any> = []
        if (Array.isArray(check)) {
            let validate = Object.keys(object);
            check.forEach((key: any, index: number) => {
                if (Array.isArray(check[index])) {
                    let v = this.validate(object[key[0]], key[1], (sub) ? sub.concat(key[0]) : key[0])
                    if (!v.valid) {
                        valid = false;
                        v.forEach((message: any) => {
                            messages.push((sub) ? sub.concat(message) : message)
                        })
                    }
                } else if (typeof key == "object") {
                    if (valid) {
                        Object.keys(key).forEach((type: any) => {
                            let i = key[type]
                            switch (type.toLowerCase()) {
                                case "or":
                                    let validations: Array<any> = []
                                    i.forEach((value: any) => {
                                        validations.push(!value.map((item: any) => validate.includes(item)).includes(false))
                                    })
                                    valid = validations.includes(true)
                                    break;
                            }
                        })
                    }
                } else {
                    if (!validate.includes(key)) {
                        valid = false
                        messages.push((sub) ? sub.concat(key) : key)
                    }
                }
            })
        } else if (typeof check == 'string') {
            check = check.split('.')
            let exist = true;
            let dt: any = {}
            if (Array.isArray(check)) check.forEach((value, index) => {
                dt = JSON.parse(JSON.stringify((index == 0) ? object : dt));
                if (exist) {
                    if (index == check.length - 1) {
                        if (sub) {
                            switch (sub[0]) {
                                case 'is':
                                    valid = (dt[value] == sub[1])
                                    break;
                                default: valid = true; break;
                            }
                        }
                    } else if (!Object.keys(dt).includes(value)) { exist = false; console.log(Object.keys(dt), index, value, check.length) }
                    if (exist && valid) {
                        dt = dt[value];
                    }
                }
            });
            valid = exist && valid
        }
        return { valid: valid, message: messages }
    }
}