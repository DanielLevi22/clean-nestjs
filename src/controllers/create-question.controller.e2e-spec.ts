import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import  request from 'supertest';




describe('create question (E2E', ()=> {
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



test('[POST]/questions', async() => {
 const user =  await prisma.user.create({
    data: {
      name: 'Marcola',
      email: 'Marcola@email.com',
      password: '123456'
    }
  })
  const accessToken = jwt.sign({ sub: user.id })

  const response = await request(app.getHttpServer())
  .post('/questions')
  .set('Authorization',  `Bearer ${accessToken}`)
  .send({
        title: 'Duvidas',
        content: 'Caminhada ou corrida?'
    })



    expect(response.status).toBe(201)

    const questionOnDataBase = await prisma.question.findFirst({
        where: { 
          title: 'Duvidas',
         }
       })


    expect(questionOnDataBase).toBeTruthy()
 })
})