import { Body, Controller, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import type { Request } from 'express';
import { CurrentUser } from '@/auth/current-user-decorator'; 
import { UserPayload } from '@/auth/jwt.strategy'; 
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';

const createQuestionBodiSchema = z.object({
  title: z.string(),
  content: z.string(),
})
type CreateQuestionBodiSchema = z.infer<typeof createQuestionBodiSchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  
  constructor(private prisma: PrismaService) {}
 
  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodiSchema)) body:CreateQuestionBodiSchema ,
    @CurrentUser() user: UserPayload,
    ){
      const {content,title } = body
      const { sub: userId} = user

      const slug = this.convertToSlug(title)

      await this.prisma.question.create({
        data: {
          authorId: userId,
          title,
          content,
          slug
        }
      })
      return "ok"

  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u836f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
  
}