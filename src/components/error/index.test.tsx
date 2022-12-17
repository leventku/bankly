import { render } from "@testing-library/react";
import { Error } from ".";

test("should render as expected", () => {
  const { asFragment } = render(<Error onRetry={() => {}}/>);

  expect(asFragment()).toMatchInlineSnapshot(`
<DocumentFragment>
  <div>
    Someting went wrong.
    <button>
      Retry
    </button>
  </div>
</DocumentFragment>
`);
});
