import styles from "./TileExplorer.module.scss";
import {TileExplorerGame} from "@widgets/tile-explorer-game";

export function TileExplorer() {
  return (
    <div className={styles.tileExplorer}>
      <TileExplorerGame />
    </div>
  );
}
