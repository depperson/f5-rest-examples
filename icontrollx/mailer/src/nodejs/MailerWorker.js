"use strict";

const nodemailer = require('nodemailer');
const logger = require('f5-logger').getInstance();

/**
 * A simple REST Worker that sends emails
 * @constructor
 */
class MailerWorker {
    constructor() {
        this.WORKER_URI_PATH = "Mailer";
        this.isPublic = true;
    }

    /**
     * Send mail
     * @param {RestOperation} restOperation 
     */
    onPost(restOperation) {
        const body = restOperation.getBody();
        sendMail(body, (err, info) => {
            if (err) {
                logger.error('error', err);
            }

            logger.info('info', info);

            restOperation.setBody({info: info, error: err});

            this.completeRestOperation(restOperation);
        });
    }
}

function sendMail(opts, cb) {
    const smtpConfig = {
        host: 'smtp.pdsea.f5net.com',
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    transporter.sendMail({
        from: 'no-reply@f5.com',
        to: opts.to,
        subject: opts.subject,
        text: opts.text
    }, cb);
}

module.exports = MailerWorker;
