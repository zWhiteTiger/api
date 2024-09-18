import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './mailer.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com', // Your SMTP host
                port: 587,
                secure: false,  // Use true if port 465              // SMTP port
                auth: {
                    user: 'nattawut.whitetiger@gmail.com',      // SMTP username
                    pass: 'smhz sntd uxyr iqrk',  // SMTP password
                },
            },
            defaults: {
                from: '"No Reply" <nattawut.whitetiger@gmail.com>', // Ensure this is a valid address
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }