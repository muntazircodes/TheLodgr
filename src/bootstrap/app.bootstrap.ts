import cors from 'cors';
import express, { Express } from 'express';
import moment from 'moment';
import morgan from 'morgan';

import { init as initDB } from '../configuration/database.config';
import { init as initAdminDB } from '../configuration/database-admin.config';
import { initRouter } from '../configuration/router.config';
import { errorHandler } from '../middlewares/error-handler.middleware';

const origin = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*';

export class AppBootstrap {
    private app: Express;
    private corsOptions = {
        origin: origin,
        optionsSuccessStatus: 200,
    };

    constructor() {
        this.app = express();
    }

    getApp() {
        return this.app;
    }

    setMiddlewares() {
        this.app.use(cors(this.corsOptions));

        morgan.token('date', () => {
            return moment().format('DD/MM/YYYY hh:mm:ss a');
        });

        this.app.use(morgan(':method :url HTTP/:http-version :status - :response-time ms - :date'));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        return this;
    }

    setRoutes() {
        initRouter(this.app);

        return this;
    }

    setErrorHandler() {
        this.app.use(errorHandler);

        return this;
    }

    // Initialize Supabase clients (anon and admin) from env
    initDatabase() {
        const url = process.env.SUPABASE_URL!;
        const anon = process.env.SUPABASE_ANON_KEY!;
        const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        // app client (RLS-safe)
        initDB(url, anon);
        // admin client (server-only)
        initAdminDB(url, service);

        return this;
    }

    listen() {
        const port = process.env.PORT || '4500';

        this.app.listen(Number(port), () => {
            console.log(`🚀 App listening on port ${port}...`);
        });
    }

    static run() {
        new AppBootstrap().initDatabase().setMiddlewares().setRoutes().setErrorHandler().listen();
    }
}
