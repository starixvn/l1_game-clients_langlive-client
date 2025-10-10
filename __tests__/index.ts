describe("Simple Test Suite", () => {
  test("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should handle string operations", () => {
    const greeting = "Hello";
    const name = "World";
    expect(`${greeting} ${name}`).toBe("Hello World");
  });

  test("should handle array operations", () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers.length).toBe(5);
    expect(numbers.includes(3)).toBe(true);
  });

  test("should handle object operations", () => {
    const user = {
      name: "John",
      age: 30,
      isActive: true,
    };
    expect(user.name).toBe("John");
    expect(user.age).toBeGreaterThan(18);
    expect(user.isActive).toBe(true);
  });
});
