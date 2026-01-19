import {createContext, useContext, useEffect, useState} from "react";
import {getIsDebug, decode, encode} from "@shared";
import {cloneDeep} from "lodash";

const ServiceDataContext = createContext({});

export function ServiceDataProvider({children, storageSettings = {}}) {
  const [serviceData, setServiceData] = useState();

  const actions = {
    set(data) {
      if (!serviceData) return;

      const {storageType} = storageSettings;

      ({
        localStorage({key}, {keys = [], data}) {
          const storageId = encode(key);

          if (!keys.length) {
            localStorage.setItem(storageId, encode(JSON.stringify(data)));
            return;
          }

          const updatedServiceData = cloneDeep(serviceData);

          keys.reduce((acc, key, index, {length}) => {
            if (!acc[key])
              acc[key] = {};

            if (index === length - 1)
              acc[key] = data;

            return acc[key];
          }, updatedServiceData);

          localStorage.setItem(storageId, encode(JSON.stringify(updatedServiceData)));

          setServiceData(updatedServiceData);
        },
        api() {

        }
      })[storageType]?.(storageSettings, data);
    }
  };

  useEffect(() => {
    const {storageType} = storageSettings;

    ({
      localStorage({key}) {
        const storageId = encode(key);

        const storageData =
          localStorage.getItem(storageId)
          ??
          (() => {
            localStorage.setItem(storageId, encode(JSON.stringify({})));
            return localStorage.getItem(storageId);
          })();

        const parsedData = JSON.parse(decode(storageData));

        setServiceData(parsedData);
      },
      api() {

      }
    })[storageType]?.(storageSettings);
  }, []);

  useEffect(() => {
    getIsDebug() && console.log("CHANGED SERVICE DATA>>", serviceData);
  }, [serviceData]);

  return (
    <ServiceDataContext.Provider value={{serviceData, ...actions}}>
      {children}
    </ServiceDataContext.Provider>
  );
}

export const useServiceData = () => useContext(ServiceDataContext);