import type { Transaction as TransactionType } from "../../../types";
import { LongDate } from "../longDate";
import { Amount } from "../amount";
import { Avatar } from "./avatar";

type Props = {
  transaction: TransactionType;
};

export const Transaction = ({ transaction }: Props) => {
  return (
    <tr>
      <td>
        <div className="transaction-detail">
          <Avatar name={transaction.description} />
          <div className="transaction-description">
            {transaction.description}
            <div className="transaction-category">{transaction.category}</div>
          </div>
        </div>
      </td>
      <td>
        <LongDate value={transaction.date}></LongDate>
      </td>
      <td className="transaction-amount">
        <Amount value={transaction.amount.value} currency={transaction.amount.currency_iso}></Amount>
      </td>
    </tr>
  );
};
