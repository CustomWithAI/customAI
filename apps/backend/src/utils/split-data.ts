type ClassImageData = {
  class: string;
};

function defaultSampling<T extends ClassImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number
) {
  const result = {
    train: [] as T[],
    test: [] as T[],
    valid: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};
  for (const data of dataset) {
    if (!groupedData[data.class]) {
      groupedData[data.class] = [];
    }
    groupedData[data.class].push(data);
  }

  for (const classKey of Object.keys(groupedData)) {
    const classData = groupedData[classKey];
    const total = classData.length;
    const trainCount = Math.floor(total * trainRatio);
    const testCount = Math.floor(total * testRatio);

    result.train.push(...classData.slice(0, trainCount));
    result.test.push(...classData.slice(trainCount, trainCount + testCount));
    result.valid.push(...classData.slice(trainCount + testCount, total));
  }

  return result;
}

function stratifiedSampling<T extends ClassImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number
) {
  const result = {
    train: [] as T[],
    test: [] as T[],
    valid: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};

  for (const data of dataset) {
    if (!groupedData[data.class]) {
      groupedData[data.class] = [];
    }
    groupedData[data.class].push(data);
  }

  const minClassCount = Math.min(
    ...Object.values(groupedData).map((items) => items.length)
  );

  for (const classKey of Object.keys(groupedData)) {
    const classData = groupedData[classKey];
    const total = minClassCount;

    const shuffledData = shuffle(classData).slice(0, total);

    const trainCount = Math.floor(total * trainRatio);
    const testCount = Math.floor(total * testRatio);

    result.train.push(...shuffledData.slice(0, trainCount));
    result.test.push(...shuffledData.slice(trainCount, trainCount + testCount));
    result.valid.push(...shuffledData.slice(trainCount + testCount, total));
  }

  return result;
}

function shuffle<T extends ClassImageData>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
