import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { TransactionHistory } from ".";
import { server } from "../../../jest.setup";

describe("transaction history", () => {
  test("the expenses tab should be shown by default", async () => {
    const mockFetch = jest.spyOn(window, 'fetch')
    render(<TransactionHistory />);

    expect(screen.getByText("Transaction History")).toBeInTheDocument();

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
    fireEvent.click(screen.getByText('Retry'))
    
    const expensesTable = await screen.findByRole("table", {
      name: "Expenses",
    });
    expect(mockFetch).toHaveBeenNthCalledWith(2, "api/transactions")
    expect(expensesTable).toBeInTheDocument();
    expect(screen.getByText("-€20.25")).toBeInTheDocument();
  })

  test.skip("changing between the expenses and income tabs should show different transactions", () => {
    render(<TransactionHistory />);

    const expensesTabTrigger = screen.getByRole("tab", {
      name: "Expenses",
    });
    const incomeTabTrigger = screen.getByRole("tab", {
      name: "Income",
    });
    const expensesTable = screen.getByRole("table", {
      name: "Expenses",
    });
    const incomeTable = screen.queryByRole("table", {
      name: "Income",
    });

    expect(expensesTable).toBeInTheDocument();
    expect(incomeTable).not.toBeInTheDocument();

    expect(screen.getByText("-20.25")).toBeInTheDocument();

    incomeTabTrigger.click();

    expect(incomeTabTrigger).toHaveAttribute("data-state", "active");
    expect(expensesTabTrigger).toHaveAttribute("data-state", "inactive");
    expect(screen.queryByText("-20.25")).not.toBeInTheDocument();
  });
});
