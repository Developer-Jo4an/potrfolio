export const CollisionGroups = {
  ACTOR: "actor",
  ROAD_CHUNK: "roadChunk",
};

export const collisionConfig = {
  [CollisionGroups.ACTOR]: [CollisionGroups.ROAD_CHUNK],
};
