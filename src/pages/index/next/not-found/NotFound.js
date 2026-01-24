"use client";
import {Error} from "@shared";
import {useRouter} from "next/navigation";
import content from "../../constants/content";

const {
  notFound: {error, button},
} = content;

export function NotFound() {
  const router = useRouter();

  const onClick = () => router.push("/");

  return <Error error={error} button={{...button, events: {onClick}}} />;
}
