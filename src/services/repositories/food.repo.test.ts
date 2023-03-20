import { FoodRepo } from "./food.repo";

describe("Given the FoodRepo", () => {
  let foodMockRepo: FoodRepo;

  beforeAll(() => {
    foodMockRepo = new FoodRepo();
  });

  describe("When we call the loadFoods method", () => {
    test("Then it should make a GET request to the /foods endpoint", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          region: "CHILE",
        }),
      });
      const result = await foodMockRepo.loadFoods();
      expect(result).toEqual({ region: "CHILE" });
    });
    test("Then it should throw an error when the fetch fails to return data", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          region: "CHILE",
        }),
      });
      const result = foodMockRepo.loadFoods();
      await expect(result).rejects.toThrow();
    });
  });
  describe("When loadSingleFood is called", () => {
    test("Then it should fetch and return the food dish with the id we enter as parameter", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: "1",
          region: "test",
        }),
      });
      const result = await foodMockRepo.loadSingleFood("1");
      expect(result).toEqual({ id: "1", region: "test" });
    });
    test("Then it should throw an error if it returns no data", async () => {
      global.fetch = jest.fn().mockResolvedValue("error");
      const result = foodMockRepo.loadSingleFood("1");
      await expect(result).rejects.toThrow();
    });
  });
});
