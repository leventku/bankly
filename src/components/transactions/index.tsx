import * as Tabs from "@radix-ui/react-tabs";
import { useCallback, useEffect, useState } from "react";
import { Transaction as TransactionType } from "../../../types";
import { notReachable } from "../../common/notReachable";
import { useLoadableData } from "../../common/useLoadableData";
import { Loading } from "../loading";
import "./index.css";
import { Transaction } from "./item";

const isExpense = (transaction: TransactionType) =>
  transaction.amount.value < 0;
const isIncome = (transaction: TransactionType) => transaction.amount.value > 0;

const Expenses = ({transactions}: {transactions: TransactionType[]}) => {
  return (
    <table aria-label="Expenses">
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} key={transaction.id} />
        ))}
      </tbody>
    </table>
  );
};

const Income = ({transactions}: {transactions: TransactionType[]}) => {
  return (
    <table aria-label="Income">
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} key={transaction.id} />
        ))}
      </tbody>
    </table>
  );
};

export const TransactionHistory = () => {
  const [loadable] = useLoadableData<TransactionType>('api/transactions')

  
  return (
    <>
      <h1 className="align-left">Transaction History</h1>
      <Tabs.Root defaultValue="expenses" className="flow">
        <Tabs.List className="tabs__list" aria-label="Filter your transactions">
          <Tabs.Trigger value="expenses">Expenses</Tabs.Trigger>
          <Tabs.Trigger value="income">Income</Tabs.Trigger>
        </Tabs.List>

        {(() => {
          switch (loadable.type) {
            case 'loaded':
              let incoming: TransactionType[] = []
              const outgoing: TransactionType[] = []
              loadable.data.forEach((item) => {
                if (isIncome(item)) {
                  incoming.push(item)
                }
                if (isExpense(item)) {
                  outgoing.push(item)
                }
              })

              return (
                <>
                  <Tabs.Content className="TabsContent" value="expenses">
                    <Expenses transactions={outgoing} />
                  </Tabs.Content>
                  <Tabs.Content className="TabsContent" value="income">
                    <Income transactions={incoming} />
                  </Tabs.Content>
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
        })()}

       
      </Tabs.Root>
    </>
  );
};
