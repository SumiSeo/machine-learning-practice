const outputs = [];

//1. gather data
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  // let numberCorrect = 0;
  // //1. split data
  const [testSet, trainingSet] = splitDataset(minMax(outputs, 3), testSetSize);
  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   console.log("prection:", bucket, "true value:", testSet[i][3]);
  //   if (bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  // }

  _.range(1, 15).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === testPoint[3]
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log("k Value", k, "Accuracy", accuracy);
  });
}

//3. run knn algorithme with traning set of data
function knn(data, point, kValue) {
  return _.chain(data)
    .map((row) => [distance(_.initial(row)), point, _.last(row)])
    .sortBy((row) => row[0])
    .slice(0, kValue)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[0])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

//2. split dataset
function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) {
    const column = cloneData.map((row) => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] - min) / (max - min);
    }
  }
  return cloneData;
}
