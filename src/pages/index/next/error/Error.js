"use client";
import {useEffect, useState} from "react";
import {createInterval, Error as ErrorMessage, getIsDebug, SPLITTER} from "@shared";
import content from "../../constants/content";

const {error} = content;

export function Error() {
  const [counter, setCounter] = useState(getIsDebug() ? error.seconds.dev : error.seconds.prod);

  useEffect(() => {
    return createInterval(() => {
      setCounter((prev) => Math.max(0, --prev));
    }, 1000);
  }, []);

  useEffect(() => {
    if (counter === 0) window.location.reload();
  }, [counter]);

  return <ErrorMessage message={error.message.replace(SPLITTER, counter.toString())} />;
}
