import { hashPassword, verifyPassword } from "./crypto";

describe("Password hashing", () => {
  it("should be correct", async () => {
    const hash = await hashPassword("password");
    const success = await verifyPassword("password", hash);
    expect(success).toBe(true);
  });

  it("should be incorrect", async () => {
    const hash = await hashPassword("password");
    const success = await verifyPassword("differentPassword", hash);
    expect(success).toBe(false);
  });
});
