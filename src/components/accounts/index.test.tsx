import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import user from '@testing-library/user-event'
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
        expect(screen.getByText("£300.00")).toBeInTheDocument();
        expect(screen.getByText("Total EUR")).toBeInTheDocument();
        expect(screen.getByText("€400.00")).toBeInTheDocument();
        expect(screen.getByText("Total USD")).toBeInTheDocument();
        expect(screen.getByText("$500.00")).toBeInTheDocument();

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

    test('Error state and retry fetch', async () => {
        server.use(
            rest.get("/api/accounts", (req, res, ctx) =>
                res(ctx.status(400))
            )
        );

        const mockFetch = jest.spyOn(window, 'fetch')
        render(<Accounts />);

        expect(await screen.findByText(/Someting went wrong./)).toBeInTheDocument();
        expect(mockFetch).toHaveBeenNthCalledWith(1, "api/accounts")

        expect(screen.queryByText("Total GBP")).not.toBeInTheDocument();

        server.resetHandlers()
        await user.click(screen.getByText('Retry'))
        expect(mockFetch).toHaveBeenNthCalledWith(2, "api/accounts")
        expect(await screen.findByText("Loading...")).toBeInTheDocument();
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'))

        expect(await screen.findByText("Total GBP")).toBeInTheDocument();
        expect(mockFetch).toHaveBeenNthCalledWith(2, "api/accounts")
        expect(screen.getByText("Total EUR")).toBeInTheDocument();
        expect(screen.getByText("Total USD")).toBeInTheDocument();
    })
})
