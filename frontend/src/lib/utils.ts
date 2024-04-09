// eslint-disable-next-line import/prefer-default-export
import Konva from "konva";
import { aPoint } from "@models/roi";

export function addTime(date: Date, second: number) {
  date.setTime(date.getTime() + second * 1000)

  return date
}

export const centroid: (arr: Array<aPoint>) => Konva.Vector2d = function (arr) {
  let x = arr.map((xy) => xy[0]);
  let y = arr.map((xy) => xy[1]);
  let cx = (Math.min(...x) + Math.max(...x)) / 2;
  let cy = (Math.min(...y) + Math.max(...y)) / 2;
  return { x: cx, y: cy };
};


export const b64toBlob = async (base64: string) =>
await fetch(base64).then((r) => r.blob());

export const getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const objectFilter = (obj: Object, predicate: any) => 
Object.keys(obj)
      .filter( (key: string) => predicate(obj[key]) )
      .reduce( (res, key) => (res[key] = obj[key], res), {} );

export const deepCopy = (obj: Object) => JSON.parse(JSON.stringify(obj));