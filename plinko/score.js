const outputs = [];

const k = 2;

//1. gather data
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  let numberCorrect = 0;
  //1. split data
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  for (let i = 0; i < testSet.length; i++) {
    const bucket = knn(trainingSet, testSet[i][0]);
    console.log("prection:", bucket, "true value:", testSet[i][3]);
    if (bucket === testSet[i][3]) {
      numberCorrect++;
    }
  }
  console.log("testSetSize", numberCorrect / testSetSize);
}

//3. run knn algorithme with traning set of data
function knn(data, point) {
  return _.chain(data)
    .map((row) => [distance(row[0], point), row[3]])
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[0])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

//2. split dataset
function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
