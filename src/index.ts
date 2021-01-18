import express from "express";
import morgan from "morgan";
import createError from "http-errors";

// import logger
import logger, { stream } from "./logger";

const app = express();

// environments
app.set("port", process.env.PORT || 3000);

// morgan middleware setup
if (process.env.NODE_ENV === "production") {
    // in production mode, use "common"
    app.use(
        morgan("common", {
            skip: (req, res) => res.statusCode < 400, // skip log whose status code is lower than 400.
            stream,
        })
    );
} else {
    // in development mode, use "tiny"
    app.use(
        morgan("tiny", {
            stream,
        })
    );
}

// route
app.get("/", (req, res) => {
    res.send("Hello Damn World..");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(
    (
        err: createError.HttpError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        let httpErr: createError.HttpError = err;
        if (!err.status) httpErr = createError(err); // create httpError by err

        if (err.status >= 500) logger.error(err.toString());

        res.status(httpErr.status).send({
            message: httpErr.message,
            // add status and stack property if it is dev mode.
            ...(process.env.NODE_ENV === "development" && {
                status: httpErr.status,
                stack: httpErr.stack,
            }),
        });
    }
);

// listen
app.listen(app.get("port"), () => {
    logger.info("Server start");
});
