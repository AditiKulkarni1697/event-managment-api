const { userRegistration } = require("../../../controller/user.controller");
const { UserModel } = require("../../../models/user.model");
const bcrypt = require("bcrypt");
const { logger } = require("../../../helpers/logger");

// Mock dependencies
jest.mock("../../../models/user.model");
jest.mock("bcrypt");
jest.mock("../../../helpers/logger");

describe("userRegistration Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    // Mock bcrypt.hash
    bcrypt.hash.mockResolvedValue("hashedPassword123");

    // Mock UserModel.save
    UserModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(),
    }));

    await userRegistration(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 8);
    expect(UserModel).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: " User registered successfully" });
  });

  it("should handle errors during registration and log them", async () => {
    // Mock bcrypt.hash to throw an error
    const errorMessage = "Hashing error";
    bcrypt.hash.mockRejectedValue(new Error(errorMessage));

    await userRegistration(req, res, next);

    expect(logger.error).toHaveBeenCalledWith(errorMessage);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("should handle errors during UserModel.save and log them", async () => {
    // Mock bcrypt.hash
    bcrypt.hash.mockResolvedValue("hashedPassword123");

    // Mock UserModel.save to throw an error
    const errorMessage = "Database save error";
    UserModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error(errorMessage)),
    }));

    await userRegistration(req, res, next);

    expect(logger.error).toHaveBeenCalledWith(errorMessage);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
