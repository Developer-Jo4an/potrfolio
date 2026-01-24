"use client";
import {createInterval, Error as ErrorMessage, SPLITTER} from "@shared";
import {useEffect, useState} from "react";
import content from "../../constants/content";

const {error} = content;

export function Error() {
  const [counter, setCounter] = useState(error.seconds);

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
