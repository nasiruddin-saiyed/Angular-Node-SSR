
import { Request, Response } from "express";

export class Routes {
    public routes(app): void {
        app.get("/api", (req, res) => {
            res.send("Hi!!!");
        });

        app.route('/api/test')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })
    }
}