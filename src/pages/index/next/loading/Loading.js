"use client";
import {Image, Loader} from "@shared";
import content from "../../constants/content";
import styles from "./Loading.module.scss";

const {loading: {background}} = content;

export function Loading() {
  return (
    <div className={styles.loading}>
      <Image {...background} className={styles.background}/>
      <Loader isPending={true}/>
    </div>
  );
}
