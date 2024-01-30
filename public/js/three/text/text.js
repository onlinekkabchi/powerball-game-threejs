let text = "three.js",
  bevelEnabled = true,
  font = undefined,
  fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight = "bold"; // normal bold

const fontHeight = 20,
  fontSize = 70,
  fontHover = 30,
  fontCurveSegments = 4,
  fontBevelThickness = 2,
  fontBevelSize = 1.5;

const fontMirror = true;

const fontMap = {
  helvetiker: 0,
  optimer: 1,
  gentilis: 2,
  "droid/droid_sans": 3,
  "droid/droid_serif": 4,
};

const weightMap = {
  regular: 0,
  bold: 1,
};

export {
  text,
  bevelEnabled,
  font,
  fontName,
  fontWeight,
  fontHeight,
  fontSize,
  fontHover,
  fontCurveSegments,
  fontBevelSize,
  fontBevelThickness,
  fontMirror,
  fontMap,
  weightMap,
};
