interface ClassificationAnnotation {
  label: string;
}

interface ObjectDetectionAnnotation {
  annotation: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }[];
}

interface SegmentationAnnotation {
  annotation: {
    points: { x: number; y: number }[];
    label: string;
  }[];
}

interface DatasetImageData {
  url: string;
  annotation: unknown;
}

function isClassificationAnnotation(
  annotation: unknown
): annotation is ClassificationAnnotation {
  return (annotation as ClassificationAnnotation).label !== undefined;
}

function isObjectDetectionAnnotation(
  annotation: unknown
): annotation is ObjectDetectionAnnotation {
  return (annotation as ObjectDetectionAnnotation).annotation !== undefined;
}

function isSegmentationAnnotation(
  annotation: unknown
): annotation is SegmentationAnnotation {
  return (
    (annotation as SegmentationAnnotation).annotation !== undefined &&
    Array.isArray((annotation as SegmentationAnnotation).annotation[0].points)
  );
}

type SplitResult<T> = {
  trainData: T[];
  testData: T[];
  validData: T[];
};

export function defaultSplit<T extends DatasetImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number,
  labels: string[]
): SplitResult<T> {
  const result = {
    trainData: [] as T[],
    testData: [] as T[],
    validData: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};

  for (const data of dataset) {
    let dataLabels: string[] = [];

    if (isClassificationAnnotation(data.annotation)) {
      dataLabels = [data.annotation.label];
    } else if (isObjectDetectionAnnotation(data.annotation)) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    } else if (isSegmentationAnnotation(data.annotation)) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    }

    for (const label of dataLabels) {
      if (labels.includes(label)) {
        if (!groupedData[label]) {
          groupedData[label] = [];
        }
        groupedData[label].push(data);
      }
    }
  }

  for (const label of Object.keys(groupedData)) {
    const classData = groupedData[label];
    const total = classData.length;
    const trainCount = Math.floor(total * trainRatio);
    const testCount = Math.floor(total * testRatio);

    result.trainData.push(...classData.slice(0, trainCount));
    result.testData.push(
      ...classData.slice(trainCount, trainCount + testCount)
    );
    result.validData.push(...classData.slice(trainCount + testCount, total));
  }

  return result;
}

export function stratifiedSplit<T extends DatasetImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number,
  labels: string[]
): SplitResult<T> {
  const result = {
    trainData: [] as T[],
    testData: [] as T[],
    validData: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};

  for (const data of dataset) {
    let dataLabels: string[] = [];

    if (isClassificationAnnotation(data.annotation)) {
      dataLabels = [data.annotation.label];
    } else if (isObjectDetectionAnnotation(data.annotation)) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    } else if (isSegmentationAnnotation(data.annotation)) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    }

    for (const label of dataLabels) {
      if (labels.includes(label)) {
        if (!groupedData[label]) {
          groupedData[label] = [];
        }
        groupedData[label].push(data);
      }
    }
  }

  const minClassCount = Math.min(
    ...Object.values(groupedData).map((items) => items.length)
  );

  for (const label of Object.keys(groupedData)) {
    const classData = groupedData[label];
    const total = minClassCount;

    const shuffledData = shuffle(classData).slice(0, total);

    const trainCount = Math.floor(total * trainRatio);
    const testCount = Math.floor(total * testRatio);

    result.trainData.push(...shuffledData.slice(0, trainCount));
    result.testData.push(
      ...shuffledData.slice(trainCount, trainCount + testCount)
    );
    result.validData.push(...shuffledData.slice(trainCount + testCount, total));
  }

  return result;
}

function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
