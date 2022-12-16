import { render, screen } from "@testing-library/react";
import App from "./app";

it("App renders without crashing", async () => {
  render(<App />);

  expect(await screen.findByText("Your accounts")).toBeInTheDocument();
});
