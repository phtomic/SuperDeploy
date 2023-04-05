import { Globals } from './Globals';
import { GitController } from './GitController';
import { NpmController } from './NpmController';
import { ConsoleController } from './ConsoleController';

export class Controllers {
    public GitController: GitController;
    public NpmController: NpmController;
    public ConsoleController: ConsoleController;
    private globals: Globals;
    constructor(globals: Globals) {
        this.globals = globals;
        this.GitController = new GitController(globals);
        this.NpmController = new NpmController(globals);
        
        this.ConsoleController = new ConsoleController(globals);
        
    }
}