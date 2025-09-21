import importPIXI from "./pixi/import-pixi";
import importMatter from "./matter/import-matter";
import importPIXILayers from "./pixi-layers/import-pixi-layers";

const imports = {
  pixi: importPIXI,
  pixiLayers: importPIXILayers,
  matter: importMatter
};

export default imports;