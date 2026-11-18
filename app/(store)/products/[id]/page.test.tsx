import { test, vi } from "vitest";
import { render } from "@testing-library/react";
import Page from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

test("renders without crashing", () => {
  render(<Page params={{ id: "p1" }} />);
});
