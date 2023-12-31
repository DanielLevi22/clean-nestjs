import { Controller, Get, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
 

const pageQuerySchema = z.string().optional().default('1').transform(Number).pipe(
  z.number().min(1)
)


const queryValidationPipe =new ZodValidationPipe(pageQuerySchema)

type PageQueryPipeSchema = z.infer<typeof pageQuerySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  
  constructor(private prisma: PrismaService) {}
 
  @Get()
  async handle(@Query('page' ,queryValidationPipe) page:PageQueryPipeSchema){
      const perPage = 20
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc'
      },
    })

    return { questions }
 }
}