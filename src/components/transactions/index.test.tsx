import { render, screen, act, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import user from '@testing-library/user-event'
import { rest } from "msw";
import { TransactionHistory } from ".";
import { server } from "../../../jest.setup";

describe("transaction history", () => {
  test("the expenses tab should be shown by default", async () => {
    const mockFetch = jest.spyOn(window, 'fetch')
    render(<TransactionHistory />);

    expect(screen.getByText("Transaction history")).toBeInTheDocument();

    const expensesTabTrigger = screen.getByRole("tab", {
      name: "Expenses",
    });

    expect(expensesTabTrigger).toHaveAttribute("data-state", "active");

    expect(await screen.findByText("Loading...")).toBeInTheDocument();

    const expensesTable = await screen.findByRole("table", {
      name: "Expenses",
    });

    expect(mockFetch).toHaveBeenCalledWith("api/transactions")

    expect(expensesTable).toBeInTheDocument();
    expect(screen.getByText("-€20.25")).toBeInTheDocument();
  });

  test('Loading state', async () => {
    server.use(
      rest.get("/api/transactions", (req, res, ctx) =>
        res(ctx.delay('infinite'), ctx.json({}))
      )
    );
    render(<TransactionHistory />);

    expect(await screen.findByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByRole("table", {
      name: "Expenses",
    })).not.toBeInTheDocument()
  })

  test('Error state and retry fetch', async () => {
    server.use(
      rest.get("/api/transactions", (req, res, ctx) =>
        res(ctx.status(400))
      )
    );

    const mockFetch = jest.spyOn(window, 'fetch')

    render(<TransactionHistory />);

    expect(await screen.findByText(/Someting went wrong./)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenNthCalledWith(1, "api/transactions")

    expect(screen.queryByRole("table", {
      name: "Expenses",
    })).not.toBeInTheDocument()

    server.resetHandlers()
    await user.click(screen.getByText('Retry'))

    expect(mockFetch).toHaveBeenNthCalledWith(2, "api/transactions")
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText('Loading...'))
    await screen.findByRole("table", {
      name: "Expenses",
    });
    expect(await screen.findByText("-€20.25")).toBeInTheDocument()
  })

  test("changing between the expenses and income tabs should show different transactions", async () => {
    render(<TransactionHistory />);

    const expensesTabTrigger = screen.getByRole("tab", {
      name: "Expenses",
    });
    const incomeTabTrigger = screen.getByRole("tab", {
      name: "Income",
    });
    const expensesTable = await screen.findByRole("table", {
      name: "Expenses",
    });
    let incomeTable = screen.queryByRole("table", {
      name: "Income",
    });

    expect(expensesTable).toBeInTheDocument();
    expect(incomeTable).not.toBeInTheDocument();

    expect(screen.getByText("-€20.25")).toBeInTheDocument();

    user.click(incomeTabTrigger);

    incomeTable = await screen.findByRole("table", {
      name: "Income",
    });
    expect(incomeTable).toBeInTheDocument();

    expect(incomeTabTrigger).toHaveAttribute("data-state", "active");
    expect(expensesTabTrigger).toHaveAttribute("data-state", "inactive");
    expect(screen.queryByText("-€20.25")).not.toBeInTheDocument();
  });
});
