class UserService {
    constructor(getFullName) {
      this.getFullName = getFullName;
    }
    
    greet() {
      const fullName = this.getFullName("John", "Doe");
      const greeting = `Hello, ${fullName}!`;
      return greeting.toUpperCase();
    }
  }
  
  function asyncHello() {
    return new Promise((resolve) => {
      setTimeout(() => resolve("hello world"), 100);
    });
  }
  
  function getNumber() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(42), 100);
    });
  }
  
  async function computeValue() {
    const number = await getNumber();
    return number * 2 + 10;
  }
  
  function asyncError() {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Something went wrong")), 100);
    });
  }
  
  class ApiClient {
    async fetchData() {
      const response = await fetch("https://api.example.com/data");
      const data = await response.json();
      return { ...data, fetchedAt: Date.now() };
    }
  }
  
  class ApiHelper {
    async fetchViaHelper(apiCallFunction) {
      const data = await apiCallFunction();
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid data");
      }
      return data;
    }
  }
  
  function calculateFinalPrice(order, discountService) {
    if (!order || !order.items || order.items.length === 0) {
      throw new Error("Invalid order");
    }
    
    const subtotal = order.items.reduce((sum, item) => {
      if (item.price < 0 || item.quantity < 0) {
        throw new Error("Invalid item data");
      }
      return sum + item.price * item.quantity;
    }, 0);
    
    let discount = 0;
    if (discountService && typeof discountService.getDiscount === 'function') {
      discount = discountService.getDiscount(subtotal);
    }
    
    if (discount > 0.5) {
      discount = 0.5;
    }
    
    const totalAfterDiscount = subtotal * (1 - discount);
    const totalWithTax = totalAfterDiscount * (1 + order.taxRate);
    return Math.round(totalWithTax * 100) / 100;
  }
  
  class OrderProcessor {
    constructor(currencyConverter) {
      this.currencyConverter = currencyConverter;
    }
    
    async processOrder(order, targetCurrency) {
      const finalPrice = calculateFinalPrice(order, order.discountService);
      if (targetCurrency && this.currencyConverter) {
        try {
          const convertedPrice = await this.currencyConverter(finalPrice, order.currency, targetCurrency);
          return convertedPrice;
        } catch (e) {
          return finalPrice;
        }
      }
      return finalPrice;
    }
  }
  
  module.exports = {
    UserService,
    asyncHello,
    computeValue,
    asyncError,
    ApiClient,
    ApiHelper,
    calculateFinalPrice,
    OrderProcessor,
    getNumber,
  };