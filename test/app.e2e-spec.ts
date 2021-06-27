import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 주의 : 실제 서버 애플리케이션과 같은 설정을 해줘야한다.
    // pipe, whitelist, forbidNonWhitelisted, transform 등등
    app.useGlobalPipes(new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }
    ));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my movie api');
  });

  describe('/movies', () => {
    it("GET", () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([]);
    });

    it("POST 201", () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: "Test",
          year: 2000,
          genres: ['Test'],
        })
        .expect(201);
    });

    it("POST 400", () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: "Test",
          year: 2000,
          genres: ['Test'],
          other: 'somethings'
          // forbidNonWhitelisted 설정으로 400를 기대하는 잘못된 other 값.
        })
        .expect(400);
    });

    it("DELETE", () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404);
    });
  });

  describe('/movies/:id', () => {
    it("GET 200", () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200)
    });

    it("GET 404", () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404)
    });

    it("PATCH 200", () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: "Updated Test"})
        .expect(200)
    });

    it("DELETE 200", () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200)
    });
  })
});