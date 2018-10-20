export const createDataPoint = (data, time = Date.now(), magnitude = 1000, offset = 0) => {
  return [
    time + offset * magnitude,
    data
  ];
};

export const addDataPoint = (data, toAdd) => {
  if (!toAdd) toAdd = createDataPoint(100);
  const newData = data.slice(0); // Clone
  newData.push(toAdd);
  return newData;
};
