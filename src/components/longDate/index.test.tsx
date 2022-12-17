import { render } from "@testing-library/react";
import { LongDate } from ".";

test("should render as expected", () => {
  const { asFragment } = render(<LongDate value="2022-06-24" />);

  expect(asFragment()).toMatchInlineSnapshot(`
<DocumentFragment>
  <div>
    24 June 2022
  </div>
</DocumentFragment>
`);
});
