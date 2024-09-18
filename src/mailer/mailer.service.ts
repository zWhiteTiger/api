import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    private otpStore = new Map<string, string>(); // In-memory storage for OTPs

    async sendOtpEmail(email: string, otp: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        });

        // Store OTP temporarily
        this.otpStore.set(email, otp);
    }

    async getOtp(email: string): Promise<string | undefined> {
        return this.otpStore.get(email);
    }

    // Optionally, you may want to clear the OTP after verification
    clearOtp(email: string) {
        this.otpStore.delete(email);
    }
}
