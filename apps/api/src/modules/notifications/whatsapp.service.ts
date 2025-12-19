import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl = 'https://evolution-evolution-api.6hjchk.easypanel.host';
  private readonly instance = 'Atender';
  private readonly apiKey = '429683C4C977415CAAFCCE10F7D57E11';

  async sendText(number: string, text: string) {
    if (!number) {
        this.logger.warn('No number provided for WhatsApp message');
        return;
    }

    // Ensure number format? Evolution usually expects clean numbers (e.g., 5511999999999)
    // assuming number comes correctly formatted from User profile or we sanitize it.
    
    try {
      const url = `${this.apiUrl}/message/sendText/${this.instance}`;
      const body = {
        number: number,
        text: text,
      };
      
      const response = await axios.post(url, body, {
        headers: {
          apikey: this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`WhatsApp sent to ${number}: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp to ${number}`, error.response?.data || error.message);
      // Don't throw, just log. Notifications shouldn't break the main flow.
    }
  }
}
