import { render, screen } from "@testing-library/react";
import { Accounts } from ".";

describe("Your accounts", () => {
    test("should show up with fetched data", async () => {
        const mockFetch = jest.spyOn(window, 'fetch')
        render(<Accounts />);
    

        expect(await screen.findByText("Total GBP")).toBeInTheDocument();
        expect(screen.getByText("200000")).toBeInTheDocument();
        expect(screen.getByText("Total EUR")).toBeInTheDocument();
        expect(screen.getByText("26234.28")).toBeInTheDocument();
        expect(screen.getByText("Total USD")).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();

        expect(mockFetch).toHaveBeenCalledWith("api/accounts")
    })
})
