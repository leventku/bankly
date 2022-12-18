import type { Account } from "../../../types";
import { Amount } from "../amount";
import "./index.css";

type Props = {
  account: Account;
};

export const AccountItem = ({ account }: Props) => {
  return (
    <div className="account">
      <div className="total">
        Total {account.balance.amount.currency}
      </div>
      <div className="amount">
        <Amount
          value={account.balance.amount.value}
          currency={account.balance.amount.currency} 
        />
      </div>
    </div>
  );
};
