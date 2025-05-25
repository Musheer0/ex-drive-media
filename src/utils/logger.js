import winston from "winston";

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.json(),
        winston.format.timestamp()
    ),
    transports: [
        new winston.transports.Console({
        format:
            winston.format.combine(
                winston.format.simple(),
                winston.format.colorize(),
                        winston.format.errors({stack:true})

            )
        
    }),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'})
    ],
    defaultMeta: {service: 'auth-service'}
})