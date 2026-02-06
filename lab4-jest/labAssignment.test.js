const {
    UserService,
    asyncHello,
    computeValue,
    asyncError,
    ApiClient,
    ApiHelper,
    calculateFinalPrice,
    OrderProcessor,
    getNumber,
  } = require("./labAssignment");
  
  // -----------------------------
  // 1. UserService.greet()
  // -----------------------------
  describe("UserService", () => {
    test("greet() calls getFullName with correct args and returns uppercase greeting", () => {
      const mockGetFullName = jest.fn().mockReturnValue("John Doe");
      const service = new UserService(mockGetFullName);
  
      const result = service.greet();
  
      expect(mockGetFullName).toHaveBeenCalledWith("John", "Doe");
      expect(result).toBe("HELLO, JOHN DOE!");
    });
  });
  
  // -----------------------------
  // 2. asyncHello()
  // -----------------------------
  describe("asyncHello", () => {
    test("resolves to 'hello world' (using resolves)", () => {
      return expect(asyncHello()).resolves.toBe("hello world");
    });
  
    test("resolves to 'hello world' (using async/await)", async () => {
      const result = await asyncHello();
      expect(result).toBe("hello world");
    });
  });
  
  // -----------------------------
  // 3. computeValue()
  // -----------------------------
  describe("computeValue", () => {
    test("returns 94", async () => {
      const result = await computeValue();
      expect(result).toBe(94);
    });
  });
  
  // -----------------------------
  // 4. asyncError()
  // -----------------------------
  describe("asyncError", () => {
    test("rejects with 'Something went wrong'", async () => {
      await expect(asyncError()).rejects.toThrow("Something went wrong");
    });
  });
  
  // -----------------------------
  // 5. ApiClient.fetchData()
  // -----------------------------
  describe("ApiClient", () => {
    test("fetchData returns JSON with fetchedAt field", async () => {
      const mockJson = { a: 1, b: 2 };
  
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockJson),
      });
  
      const client = new ApiClient();
      const result = await client.fetchData();
  
      expect(result).toHaveProperty("a", 1);
      expect(result).toHaveProperty("b", 2);
      expect(result).toHaveProperty("fetchedAt");
      expect(typeof result.fetchedAt).toBe("number");
    });
  });
  
  // -----------------------------
  // 6. ApiHelper.fetchViaHelper()
  // -----------------------------
  describe("ApiHelper", () => {
    test("fetchViaHelper returns data from mocked apiCallFunction", async () => {
      const mockData = { x: 10 };
      const mockApiCall = jest.fn().mockResolvedValue(mockData);
  
      const helper = new ApiHelper();
      const result = await helper.fetchViaHelper(mockApiCall);
  
      expect(result).toEqual(mockData);
    });
  
    test("throws error for invalid data", async () => {
      const mockApiCall = jest.fn().mockResolvedValue(null);
  
      const helper = new ApiHelper();
  
      await expect(helper.fetchViaHelper(mockApiCall)).rejects.toThrow("Invalid data");
    });
  });
  
  // -----------------------------
  // 7. calculateFinalPrice()
  // -----------------------------
  describe("calculateFinalPrice", () => {
    test("correctly calculates final price", () => {
      const order = {
        items: [
          { price: 20, quantity: 2 }, // 40
          { price: 10, quantity: 3 }, // 30
        ],
        taxRate: 0.2,
      };
  
      const discountService = {
        getDiscount: jest.fn().mockReturnValue(0.3), // 30%
      };
  
      // subtotal = 70
      // discount = 30% ? 49
      // tax = 20% ? 58.8
      // rounded = 58.8
  
      const result = calculateFinalPrice(order, discountService);
      expect(result).toBe(58.8);
    });
  
    test("caps discount at 50%", () => {
      const order = {
        items: [{ price: 100, quantity: 1 }],
        taxRate: 0,
      };
  
      const discountService = {
        getDiscount: jest.fn().mockReturnValue(0.9), // too high ? capped to 0.5
      };
  
      const result = calculateFinalPrice(order, discountService);
      expect(result).toBe(50);
    });
  
    test("throws error for invalid order", () => {
      expect(() => calculateFinalPrice(null)).toThrow("Invalid order");
      expect(() => calculateFinalPrice({ items: [] })).toThrow("Invalid order");
    });
  
    test("throws error for negative item values", () => {
      const order = {
        items: [{ price: -10, quantity: 1 }],
        taxRate: 0,
      };
      expect(() => calculateFinalPrice(order)).toThrow("Invalid item data");
    });
  });
  
  // -----------------------------
  // 8. OrderProcessor.processOrder()
  // -----------------------------
  describe("OrderProcessor", () => {
    test("returns converted final price when converter works", async () => {
      const order = {
        items: [{ price: 50, quantity: 1 }],
        taxRate: 0,
        currency: "USD",
        discountService: { getDiscount: () => 0 },
      };
  
      const mockConverter = jest.fn().mockResolvedValue(100);
  
      const processor = new OrderProcessor(mockConverter);
      const result = await processor.processOrder(order, "EUR");
  
      expect(mockConverter).toHaveBeenCalledWith(50, "USD", "EUR");
      expect(result).toBe(100);
    });
  
    test("returns original price when converter throws error", async () => {
      const order = {
        items: [{ price: 50, quantity: 1 }],
        taxRate: 0,
        currency: "USD",
        discountService: { getDiscount: () => 0 },
      };
  
      const mockConverter = jest.fn().mockRejectedValue(new Error("Conversion failed"));
  
      const processor = new OrderProcessor(mockConverter);
      const result = await processor.processOrder(order, "EUR");
  
      expect(result).toBe(50);
    });
  });
  