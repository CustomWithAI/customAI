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

interface ImageData {
  url: string;
  annotation:
    | ClassificationAnnotation
    | ObjectDetectionAnnotation
    | SegmentationAnnotation;
}

function isClassificationAnnotation(
  annotation:
    | ClassificationAnnotation
    | ObjectDetectionAnnotation
    | SegmentationAnnotation
): annotation is ClassificationAnnotation {
  return (annotation as ClassificationAnnotation).label !== undefined;
}

function isObjectDetectionAnnotation(
  annotation:
    | ClassificationAnnotation
    | ObjectDetectionAnnotation
    | SegmentationAnnotation
): annotation is ObjectDetectionAnnotation {
  return (annotation as ObjectDetectionAnnotation).annotation !== undefined;
}

function isSegmentationAnnotation(
  annotation:
    | ClassificationAnnotation
    | ObjectDetectionAnnotation
    | SegmentationAnnotation
): annotation is SegmentationAnnotation {
  return (
    (annotation as SegmentationAnnotation).annotation !== undefined &&
    Array.isArray((annotation as SegmentationAnnotation).annotation[0].points)
  );
}

type SplitResult<T> = {
  train: T[];
  test: T[];
  valid: T[];
};

function defaultSplit<T extends ImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number,
  labels: string[],
  type: "classification" | "objectDetection" | "segmentation"
): SplitResult<T> {
  const result = {
    train: [] as T[],
    test: [] as T[],
    valid: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};

  for (const data of dataset) {
    let dataLabels: string[] = [];

    if (
      type === "classification" &&
      isClassificationAnnotation(data.annotation)
    ) {
      dataLabels = [data.annotation.label];
    } else if (
      type === "objectDetection" &&
      isObjectDetectionAnnotation(data.annotation)
    ) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    } else if (
      type === "segmentation" &&
      isSegmentationAnnotation(data.annotation)
    ) {
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

    result.train.push(...classData.slice(0, trainCount));
    result.test.push(...classData.slice(trainCount, trainCount + testCount));
    result.valid.push(...classData.slice(trainCount + testCount, total));
  }

  return result;
}

function stratifiedSplit<T extends ImageData>(
  dataset: T[],
  trainRatio: number,
  testRatio: number,
  validRatio: number,
  labels: string[],
  type: "classification" | "objectDetection" | "segmentation"
): SplitResult<T> {
  const result = {
    train: [] as T[],
    test: [] as T[],
    valid: [] as T[],
  };

  const groupedData: { [key: string]: T[] } = {};

  for (const data of dataset) {
    let dataLabels: string[] = [];

    if (
      type === "classification" &&
      isClassificationAnnotation(data.annotation)
    ) {
      dataLabels = [data.annotation.label];
    } else if (
      type === "objectDetection" &&
      isObjectDetectionAnnotation(data.annotation)
    ) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    } else if (
      type === "segmentation" &&
      isSegmentationAnnotation(data.annotation)
    ) {
      dataLabels = data.annotation.annotation.map((item) => item.label);
    }

    for (const label of labels) {
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

    result.train.push(...shuffledData.slice(0, trainCount));
    result.test.push(...shuffledData.slice(trainCount, trainCount + testCount));
    result.valid.push(...shuffledData.slice(trainCount + testCount, total));
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
