export class LogsController {
    private logger: any;
    constructor() {
        this.logger = {}
        this.configLog("debug");
    }
    private async configLog(type: string) {
        if (!this.logger[type]) {
            this.logger[type] = console[type]
            console[type] = (message: any, optionalParams?: any, controller?: string, priority?: number) => {
                if (controller == undefined) controller = "app";
                if (priority == undefined) priority = 0;
                this.logger[type]("".concat("[", controller.toUpperCase(), "]", "PRIOR: ", priority.toString(), " - ", message))
            }
        }
    }
}