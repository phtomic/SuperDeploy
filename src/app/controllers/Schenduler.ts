import { Controllers } from "./Controllers";

export class Schenduler {
    private controllers: Controllers;
    constructor(controllers: Controllers) {
        this.controllers = controllers;
        this.clock5s();
        this.clock15m();
        this.clock1m();
        this.clock1h();
        this.clock6h();
        this.clock12h();
        setInterval(() => { this.clock12h() }, 12 * 60 * 60 * 1000)
        setInterval(() => { this.clock6h() }, 6 * 60 * 60 * 1000)
        setInterval(() => { this.clock1h() }, 60 * 60 * 1000)
        setInterval(() => { this.clock15m() }, 60 * 15 * 1000)
        setInterval(() => { this.clock1m() }, 60 * 1000)
        setInterval(() => { this.clock5s() }, 5 * 1000)
    }
    private clock5s() {
    }
    private clock1m() {
    }
    private clock15m() {
    }
    private clock1h() {
    }
    private clock6h() {
    }
    private clock12h() {
    }
}