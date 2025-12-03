import importPixi from "./pixi/import-pixi";
import importMatter from "./matter/import-matter";
import importSat from "./sat/import-sat";
import importThree from "./three/import-three";

const imports = {
  pixi: importPixi,
  matter: importMatter,
  sat: importSat,
  three: importThree
};

export default imports;