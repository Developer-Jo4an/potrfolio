import importPixi from "./pixi/import-pixi";
import importMatter from "./matter/import-matter";
import importSat from "./sat/import-sat";
import importThree from "./three/import-three";
import importRapier3d from "./rapier/import-rapier-3d";
import importQuarks from "./quarks/import-quarks";

const imports = {
  pixi: importPixi,
  matter: importMatter,
  sat: importSat,
  three: importThree,
  rapier3d: importRapier3d,
  quarks: importQuarks
};

export default imports;