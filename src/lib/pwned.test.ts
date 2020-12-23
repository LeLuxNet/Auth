import { pwnCount } from "./pwned";

describe("Pwned passwords", () => {
  it("should be a pwned password", async () => {
    const count = await pwnCount("password1");
    expect(count).toBeGreaterThan(0);
  });

  it("should not be a pwned password", async () => {
    const count = await pwnCount("hopefullyThisNobodyUsesThisAsAPassword");
    expect(count).toBe(0);
  });
});
