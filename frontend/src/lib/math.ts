import Konva from "konva";
import {aPoint, ROI} from "@models/roi"
const classifyPoint = require("robust-point-in-polygon");

export const getAvaragePoint = (points: Array<number>) => {
  let totalX = 0;
  let totalY = 0;
  for (let i = 0; i < points.length; i += 2) {
    totalX += points[i];
    totalY += points[i + 1];
  }
  return {
    x: totalX / (points.length / 2),
    y: totalY / (points.length / 2),
  };
};

export const getL2Distance = (
  node1: [number, number],
  node2: [number, number]
) => {
  let diffX = Math.abs(node1[0] - node2[0]);
  let diffY = Math.abs(node1[1] - node2[1]);
  const distaneInPixel = Math.sqrt(diffX * diffX + diffY * diffY);
  // return Number.parseFloat(distaneInPixel.toString()).toFixed(2);
  return distaneInPixel;
};

export const dragBoundFunc = (
  stageWidth: number,
  stageHeight: number,
  vertexRadius: number,
  pos: Konva.Vector2d
) => {
  let x = pos.x;
  let y = pos.y;
  if (pos.x + vertexRadius > stageWidth) x = stageWidth;
  if (pos.x - vertexRadius < 0) x = 0;
  if (pos.y + vertexRadius > stageHeight) y = stageHeight;
  if (pos.y - vertexRadius < 0) y = 0;
  return { x, y };
};


export const dragBoundForRectangle = (
dragbRec: Array<number>,
  vertexRadius: number,
  pos: Konva.Vector2d
) => {

  let x = pos.x;
  let y = pos.y;
  if (pos.x + vertexRadius > dragbRec[2]) x = dragbRec[2];
  if (pos.x - vertexRadius < dragbRec[0]) x = dragbRec[0];
  if (pos.y + vertexRadius > dragbRec[3]) y = dragbRec[3];
  if (pos.y - vertexRadius < dragbRec[1]) y = dragbRec[1];
  return { x, y };
};

export const minMax = (points: Array<number>) => {
  return points.reduce((acc: Array<number>, val: number) => {
    acc[0] = acc[0] === undefined || val < acc[0] ? val : acc[0];
    acc[1] = acc[1] === undefined || val > acc[1] ? val : acc[1];
    return acc;
  }, []);
};

export function isTwoLineIntersected(line1: Array<aPoint>, line2: Array<aPoint>) {
  const [[x1, y1], [x2, y2]] = line1
  const [[x3, y3], [x4, y4]] = line2
  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  return true
  // Return a object with the x and y coordinates of the intersection
	// let x = x1 + ua * (x2 - x1)
	// let y = y1 + ua * (y2 - y1)

	// return {x, y}
}

export const getPDistanceAndPPoint = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {

  let A = x - x1;
  let B = y - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  let dx = x - xx;
  let dy = y - yy;
  const pPoint: aPoint = [xx, yy]
  return {pDist: Math.sqrt(dx * dx + dy * dy), pPoint: pPoint};
}

export const getPPointNDistFromNearestROISide = (mousePos: aPoint, roiPoints: Array<aPoint>) => {
  let minDist = Infinity;
  let projectedPoint = null;
  let sideIndex = 0
  for (let i = 0; i < roiPoints.length; i ++ ){
    const point1 = roiPoints[i];
    let point2 = roiPoints[i + 1];
    if (i === roiPoints.length - 1){
      point2 = roiPoints[0];
    }
    const {pDist, pPoint} = getPDistanceAndPPoint(mousePos[0], mousePos[1], point1[0], point1[1], point2[0], point2[1]);
    if (pDist < minDist){
      minDist = pDist;
      projectedPoint = pPoint;
      sideIndex = i;
    }
  }
  return {pDist: minDist, pPoint: projectedPoint, sideIndex}
}

export const isValidMousePos = (currPoints: Array<aPoint>, mousePos: aPoint) => {
  // const latestPoint = currPoints[currPoints.length - 1];
  // if (!latestPoint) return true;
  for (const point of currPoints){
    if (
      Math.abs(point[0] - mousePos[0]) < 20 &&
      Math.abs(point[1] - mousePos[1]) < 20
    )
      return false;
  }
  return true;
};

export const flattenPoints = (mousePosition: aPoint, points: Array<aPoint>, isCompleted: boolean) => {
  const newPoints: Array<number> = points
    .concat(isCompleted ? [] : mousePosition)
    .reduce((a: Array<number>, b) => a.concat(b), []);
  return newPoints;
};

export const getMousePos: (stage: Konva.Stage) => aPoint | undefined = (stage) => {
  const pos = stage.getPointerPosition();
  if (!pos) return;
  return [pos.x, pos.y];
};

export const getOutterPolygon = (mousePosition: aPoint, currROIs: Array<ROI>) => {
  let outterPolygonIndex = -1;
  for (let i = 0; i < currROIs.length - 1; i++) {
    if (classifyPoint(currROIs[i].points, mousePosition) <= 0) {
      outterPolygonIndex = i;
      break;
    }
  }
  return outterPolygonIndex;
};

export const getOriginalScalePoint: (pos: aPoint, currentImageScale: number) => aPoint = (pos, currentImageScale) => {
  return [
    pos[0] / currentImageScale,
    pos[1] / currentImageScale,
  ];
};

export const getInterInsertedPointNewLevel = (
  point1: aPoint,
  point2: aPoint,
  point3: aPoint,
  point4: aPoint,
  anchorPoint: aPoint
) => {
  const x =
    ((anchorPoint[0] - point1[0]) * (point4[0] - point3[0])) /
      (point2[0] - point1[0]) +
    point3[0];
  const y =
    ((anchorPoint[1] - point1[1]) * (point4[1] - point3[1])) /
      (point2[1] - point1[1]) +
    point3[1];
  return [x, y];
};