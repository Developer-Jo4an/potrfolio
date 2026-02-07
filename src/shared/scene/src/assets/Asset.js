export class Asset {
  defaultProperties;

  baseSettings;

  extraSettings;

  asset;

  constructor({defaultProperties, baseSettings, extraSettings}) {
    this.defaultProperties = defaultProperties;
    this.baseSettings = baseSettings;
    this.extraSettings = extraSettings;
  }

  create() {
    this.asset = {};
  }

  prepare() {
    const mergedData = this._getMergedData();
    this._setProperties(mergedData);

    return this.asset;
  }

  reset() {
    this.extraSettings = {};
  }

  updateExtraSettings(extraSettings) {
    this.extraSettings = extraSettings ?? {};
  }

  _getMergedData() {
    const {baseSettings, extraSettings} = this;
    return {...baseSettings, ...extraSettings};
  }

  _setProperties(mergedData) {
    const {asset} = this;

    for (const key in mergedData) asset[key] = mergedData[key];
  }
}
