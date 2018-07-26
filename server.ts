import "zone.js/dist/zone-node";
import "reflect-metadata";
import { enableProdMode } from "@angular/core";
import { ngExpressEngine } from "@nguniversal/express-engine";
import { provideModuleMap } from "@nguniversal/module-map-ngfactory-loader";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as compression from "compression";
import * as morgan from 'morgan';
import { join } from "path";
import { Routes } from "./lib/routes/routes";

enableProdMode();

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        // Express App
        this.app = express();
        // Config 
        this.config();
        // Congif Restful API routes.
        this.routePrv.routes(this.app);
        // Initial routes for server side html rendering
        this.client();
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(compression());
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morgan('tiny'));
        const {
            AppServerModuleNgFactory,
            LAZY_MODULE_MAP
        } = require("./dist/server/main");

        this.app.engine(
            "html",
            ngExpressEngine({
                bootstrap: AppServerModuleNgFactory,
                providers: [provideModuleMap(LAZY_MODULE_MAP)]
            })
        );

        this.app.set("view engine", "html");
        this.app.set("views", "./dist/browser");
        this.app.get("/redirect/**", (req, res) => {
            const location = req.url.substring(10);
            res.redirect(301, location);
        });
    }
    private client(): void {
        this.app.get(
            "*.*",
            express.static("./dist/browser", {
                maxAge: "1y"
            })
        );

        this.app.get("/*", (req, res) => {
            res.render("index", { req, res }, (err, html) => {
                if (html) {
                    res.send(html);
                } else {
                    console.error(err);
                    res.send(err);
                }
            });
        });
    }
}

export default new App().app;
