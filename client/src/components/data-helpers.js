import axios from "axios";

export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {
  return [
    time + offset * magnitude,
    Math.round((Math.random() * 100) * 2) / 2
  ];
};

export const createRandomData = (time, magnitude, points = 100) => {
  const data = [];
  let i = (points * -1) + 1;
  for (i; i <= 0; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

export const addDataPoint = (data, toAdd, time) => {
  if (!toAdd) toAdd = createDataPoint(time);
  const newData = data.slice(0); // Clone
  newData.push(toAdd);
  return newData;
};

export const getBitcoinData = time => {
  axios
    .post('https://ifyouhavemoneyforbitcoin.herokuapp.com', { time: Date.now() })
    .then(({ data: bitcoin }) => {
      console.log("sdf", bitcoin);
      return bitcoin.cost
    })
    .catch(err => {
      console.error(err);
    });
};
