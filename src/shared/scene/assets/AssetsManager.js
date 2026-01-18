class AssetsManager {

  spaces = {};

  getSpace(space) {
    const {spaces} = this;

    if (!spaces[space])
      spaces[space] = {};

    return spaces[space];
  }

  getSpaceType(space, type) {
    const currentSpace = this.getSpace(space);
    return currentSpace[type] ?? (currentSpace[type] = {});
  }

  setAssetsToSpace(space, type, name, alias) {
    const spaceType = this.getSpaceType(space, type);
    spaceType[name] = alias;
  }

  getAssetFromSpace(space, type, name) {
    const spaceType = this.getSpaceType(space, type);
    return spaceType[name];
  }
}

export const assetsManager = new AssetsManager();