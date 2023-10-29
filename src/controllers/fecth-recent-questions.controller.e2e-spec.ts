import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import  request from 'supertest';




describe('Fetch recent questions (E2E', ()=> {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService
 beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService)
    await app.init();
  });



test('[GET]/questions', async() => {

 const user =  await prisma.user.create({
    data: {
      name: 'Marcola',
      email: 'Marcola@email.com',
      password: '123456'
    }
  })
  
  const accessToken = jwt.sign({ sub: user.id })
  await prisma.question.createMany({
    data: [
      {
        title: 'question 01',
        content: 'content 01',
        authorId: user.id,
        slug: 'question-01'
      },
      {
        title: 'question 02',
        content: 'content 02',
        authorId: user.id,
        slug: 'question-02'
      },
    ]
  })


  const response = await request(app.getHttpServer())
  .get('/questions')
  .set('Authorization',  `Bearer ${accessToken}`)
  .send()



  

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({title: 'question 01',}),
        expect.objectContaining({title: 'question 02',}),

      ]
    })
 })
})