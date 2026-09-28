import { describe, it, expect } from "vitest";
import { cn, formatIndex, formatDate, clamp, lerp, mapRange, truncate } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});

describe("formatIndex", () => {
  it("pads single digit", () => {
    expect(formatIndex(1)).toBe("01");
    expect(formatIndex(9)).toBe("09");
  });

  it("does not pad double digit", () => {
    expect(formatIndex(10)).toBe("10");
  });

  it("supports custom padding", () => {
    expect(formatIndex(1, 3)).toBe("001");
  });
});

describe("formatDate", () => {
  it("formats year-month", () => {
    expect(formatDate("2024-03")).toBe("Mar 2024");
  });

  it("handles year only", () => {
    expect(formatDate("2024")).toBe("2024");
  });
});

describe("clamp", () => {
  it("clamps below min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns value in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe("lerp", () => {
  it("interpolates at 0", () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it("interpolates at 1", () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("interpolates at 0.5", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
});

describe("mapRange", () => {
  it("maps value between ranges", () => {
    expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5);
  });

  it("maps to different range", () => {
    expect(mapRange(5, 0, 10, 100, 200)).toBe(150);
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 8)).toBe("Hello W…");
  });

  it("does not truncate short strings", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });
});
