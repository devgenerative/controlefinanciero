import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ChatDto, ClassifyTransactionDto, SimulateDto } from './dto/ai.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private logger = new Logger(AiService.name);

  constructor(
      private configService: ConfigService,
      private prisma: PrismaService
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || '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';
    
    if (apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    } else {
        this.logger.warn('OPENAI_API_KEY not found');
    }
  }

  async classify(dto: ClassifyTransactionDto) {
    if (!this.openai) return { categoryName: 'Outros', confidence: 0 };

    try {
        const categories = await this.prisma.category.findMany({ select: { name: true, id: true } });
        const categoriesList = categories.map(c => c.name).join(', ');

        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a financial assistant. Classify the transaction description into one of these categories: ${categoriesList}. Return JSON with "categoryName" and "confidence" (0-1). If unsure, use "Outros".`
                },
                {
                    role: "user",
                    content: `Description: ${dto.description}, Amount: ${dto.amount}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        const matchedCategory = categories.find(c => c.name === result.categoryName);

        return {
            ...result,
            categoryId: matchedCategory?.id
        };

    } catch (e) {
        this.logger.error("Error classifying transaction", e);
        return { categoryName: 'Outros', confidence: 0 };
    }
  }

  async getInsights(userId: string) {
      // Mocked insights logic mixed with potential AI generation
      // In a real app, we would aggregate data and feed it to LLM for analysis
      return {
          insights: [
            {
                type: "SPENDING_INCREASE",
                severity: "WARNING",
                title: "Gastos com Delivery aumentaram 45%",
                description: "Você gastou R$ 850 com delivery este mês, comparado a R$ 586 no mês passado.",
                suggestion: "Considere cozinhar mais em casa ou definir um limite semanal para pedidos.",
                data: { current: 850, previous: 586, change: 0.45 }
            },
            {
                type: "UNUSED_SUBSCRIPTION",
                severity: "INFO",
                title: "Assinatura Netflix",
                description: "Valor recorrente de R$ 55,90 identificado.",
                suggestion: "Certifique-se que está utilizando este serviço regularmente."
            }
          ]
      };
  }

  async chat(dto: ChatDto, userId: string) {
      if (!this.openai) return { response: "AI service unavailable", suggestions: [] };

      // Fetch meaningful context (last 5 transactions, total balance, etc)
      // For now, minimal context
      const context = "User Balance: R$ 2500.00. Last Transaction: Uber R$ 25.90.";

      try {
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful financial assistant. Context: ${context}. Answer nicely.`
                },
                {
                    role: "user",
                    content: dto.message
                }
            ]
        });

        return {
            response: response.choices[0].message.content,
            suggestions: ["Ver meus gastos", "Criar nova meta"]
        };
      } catch (e) {
          return { response: "Desculpe, não consegui processar agora.", suggestions: [] };
      }
  }

  async simulate(dto: SimulateDto) {
      // Mocked simulation result
      if (dto.type === 'SAVE_MONTHLY') {
          const amount = dto.params?.amount || 0;
          return {
            scenario: `Economizar R$ ${amount}/mês`,
            impact: {
                monthly: { newBalance: 2500 + amount, savingsRate: 0.25 },
                yearly: { accumulated: amount * 12, withInterest: amount * 12 * 1.05 },
            },
            suggestions: [
                "Reduzir delivery em 30%",
                "Cancelar assinatura não utilizada"
            ]
          };
      }
      return {};
  }
}
