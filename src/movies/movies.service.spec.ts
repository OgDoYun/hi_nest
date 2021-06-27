import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Post, NotFoundException } from '@nestjs/common';
import { Server } from 'http';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("should return an array", () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("getOne", () => {
    it("should return a movie", () => {
      service.create({
        title: 'Test Movie',
        year: 2000,
        genres: ['test'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it("should throw 404 error", () => {
      let test_id = 999;
      try{
        service.getOne(test_id);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${test_id} not found.`);
      }
    })
  });
  describe("deleteOne", () => {
    it("deletes a movie", () => {
      service.create({
        title: 'Test Movie',
        year: 2000,
        genres: ['test'], 
      });
      const beforeMovies = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeMovies)
    });
    it("should return a 404", () => {
      try{
        service.deleteOne(999);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe("create", () => {
    it("should create a movie", () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test Movie',
        year: 2000,
        genres: ['test'], 
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate)
    });
  });

  describe("update", () => {
    it("should update a movie", () => {
      service.create({
        title: 'Test Movie',
        year: 2000,
        genres: ['test'], 
      });
      service.update(1, {title:"Updated Test"});
      const movie = service.getOne(1);
      expect(movie.title).toEqual("Updated Test");
    });
    it("should throw a NotFoundException", () => {
      try{
        service.update(999, {});
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  })
});
