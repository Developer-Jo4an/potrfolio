import {image as imageUrl} from "./url";

const cachedData = {};

export function loadImage(image) {
  if (cachedData[image]) return cachedData[image];

  const img = new Image();
  img.src = imageUrl(image);

  const promise = new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });

  return (cachedData[image] = {
    img,
    promise,
  });
}
