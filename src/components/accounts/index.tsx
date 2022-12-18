import { AccountItem } from "./item";
import "./index.css";
import { useLoadableData } from "../../common/useLoadableData";
import { Account } from "../../../types";
import { notReachable } from "../../common/notReachable";
import { Loading } from "../loading";
import { Error } from "../error";

export const Accounts = () => {
  const [loadable, setLoadable] = useLoadableData<Account[]>('api/accounts')

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
        return <Error onRetry={() => setLoadable({type: 'loading'})} />
  
    default:
      return notReachable(loadable)
  }
  
};
