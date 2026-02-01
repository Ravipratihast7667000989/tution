const Counter = require("../model/counter_model.js");

const generateStudentId = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const number = counter.seq.toString().padStart(4, "0");

  return `STU-${year}-${number}`;
};

module.exports = generateStudentId;
