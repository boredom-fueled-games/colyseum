import has from 'lodash/has';
import { useEffect, useState } from 'react';
import { Collection } from 'types/Collection';

const mercureSubscribe = (hubURL: string, data: unknown | Collection<unknown>, setData: (data: unknown) => void) => {
  const url = new URL(hubURL, window.origin);
  url.searchParams.append('topic', (new URL(data['@id'], window.origin)).toString());
  const eventSource = new EventSource(url.toString());
  eventSource.addEventListener('message', (event) => setData(JSON.parse(event.data)));

  return eventSource;
};

export const useMercure = (deps: unknown | Collection<unknown>, hubURL: string) => {
  const [data, setData] = useState(deps);

  useEffect(() => {
    setData(deps);
  }, [deps]);

  useEffect(() => {
    if (!hubURL || !data) {
      return;
    }

    if (has(data, 'hydra:member') && Array.isArray(data['hydra:member']) && data['hydra:member'].length !== 0) {
      data['hydra:member'].forEach((obj, pos) => mercureSubscribe(hubURL, obj, (datum) => {
        data['hydra:member'][pos] = datum;
        setData(data);
      }));

      return () => data;
    }

    const eventSource = mercureSubscribe(hubURL, data, setData);

    return () => {
      eventSource.removeEventListener('message', (event) => setData(JSON.parse(event.data)));

      return data;
    };
  }, [hubURL, data]);

  return data;
};
