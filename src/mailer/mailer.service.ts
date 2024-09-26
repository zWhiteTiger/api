import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    private otpStore = new Map<string, string>(); // In-memory storage for OTPs
    private otpExpiration = new Map<string, Date>(); // Expiration time for each OTP

    // Generate a random 6-digit OTP
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    }

    async sendOtpEmail(email: string): Promise<void> {
        const otp = this.generateOtp();
        await this.mailerService.sendMail({
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
        });

        console.log(`OTP for ${email}: ${otp}`);  // Debugging line

        this.otpStore.set(email, otp);
        this.otpExpiration.set(email, new Date(new Date().getTime() + 5 * 60000)); // 5 minutes expiration
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const storedOtp = this.otpStore.get(email);
        const expiration = this.otpExpiration.get(email);

        console.log(`Stored OTP: ${storedOtp}, Provided OTP: ${otp}`);  // Debugging line

        if (!storedOtp || !expiration) {
            throw new HttpException('OTP not found or expired', HttpStatus.BAD_REQUEST);
        }

        if (new Date() > expiration) {
            this.clearOtp(email);
            throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
        }

        if (storedOtp !== otp) {
            throw new HttpException('Incorrect OTP', HttpStatus.BAD_REQUEST);
        }

        this.clearOtp(email);

        return true;
    }

    clearOtp(email: string): void {
        this.otpStore.delete(email);
        this.otpExpiration.delete(email);
    }
}
