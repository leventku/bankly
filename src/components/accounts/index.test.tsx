import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { Accounts } from ".";
import { server } from "../../../jest.setup";

const mockData = [
    { "account_id": "121", "balance": { "amount": { "currency": "GBP", "value": 300 } } },
    { "account_id": "122", "balance": { "amount": { "currency": "EUR", "value": 400 } } },
    { "account_id": "123", "balance": { "amount": { "currency": "USD", "value": 500 } } }
];

describe("Your accounts", () => {
    test("should show up with fetched data", async () => {
        server.use(
            rest.get("/api/accounts", (req, res, ctx) =>
                res(ctx.json(mockData))
            )
        );
        const mockFetch = jest.spyOn(window, 'fetch')
        render(<Accounts />);

        expect(await screen.findByText("Total GBP")).toBeInTheDocument();
        expect(screen.getByText("300")).toBeInTheDocument();
        expect(screen.getByText("Total EUR")).toBeInTheDocument();
        expect(screen.getByText("400")).toBeInTheDocument();
        expect(screen.getByText("Total USD")).toBeInTheDocument();
        expect(screen.getByText("500")).toBeInTheDocument();

        expect(mockFetch).toHaveBeenCalledWith("api/accounts")
    })

    test('Loading state', async () => {
        server.use(
            rest.get("/api/accounts", (req, res, ctx) =>
                res(ctx.delay('infinite'), ctx.json(mockData))
            )
        );
        render(<Accounts />);

        expect(await screen.findByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Total GBP")).not.toBeInTheDocument()
    })
})
