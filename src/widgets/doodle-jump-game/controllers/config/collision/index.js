export const CollisionGroups = {
  CHARACTER: "character",
  PLATFORM: "platform",
  ENEMY: "enemy",
  BULLET: "bullet",
  BOOSTER: "booster",
  HELPER: "helper",
};

export const collisionConfig = {
  [CollisionGroups.CHARACTER]: [
    CollisionGroups.PLATFORM,
    CollisionGroups.HELPER,
    CollisionGroups.ENEMY,
    CollisionGroups.BOOSTER,
  ],
  [CollisionGroups.BULLET]: [CollisionGroups.ENEMY],
};
