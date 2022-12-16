import { AccountItem } from "./item";
import "./index.css";
import { useLoadableData } from "../../common/useLoadableData";
import { Account } from "../../../types";
import { notReachable } from "../../common/notReachable";
import { Loading } from "../loading";

export const Accounts = () => {
  const [loadable] = useLoadableData<Account>('api/accounts')

  switch (loadable.type) {
    case 'loaded':
      return (
        <>
          <h1 className="align-left">Your accounts</h1>
          <div className="accounts">
            {loadable.data.map((account) => (
              <AccountItem account={account} key={account.account_id} />
            ))}
          </div>
        </>
      );

      case 'loading':
        return <Loading />
      case 'not_asked':
        return null
      case 'error':
        return <div>Error</div>
  
    default:
      return notReachable(loadable)
  }
  
};
