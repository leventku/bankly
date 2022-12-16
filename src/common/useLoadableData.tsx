import { useEffect, useState } from "react";
import { LoadableState } from "../../types";
import { notReachable } from "./notReachable";

export const useLoadableData = <T extends unknown> (url: string, state: LoadableState<T> = { type: 'loading' }): [LoadableState<T>, React.Dispatch<React.SetStateAction<LoadableState<T>>>]  => {
  const [loadable, setLoadable] = useState<LoadableState<T>>(state)

  useEffect(() => {
    switch (loadable.type) {
      case 'loading':
        fetch(url)
          .then((response) => {
            return response.json()
          })
          .then((json) => {
            setLoadable({type: 'loaded', data: json})
          })
          .catch((ex) => {
            setLoadable({type: 'error', error: ex})
          })
        break;
      case 'loaded':
      case 'not_asked':
      case 'error':
        break;

      default:
        notReachable(loadable)
    }

  }, [url, loadable.type])

  return [loadable, setLoadable]

}
