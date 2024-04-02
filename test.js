const { correlation } = require("node-correlation");
const feedbackArray = [2, 5, 4, 1];
const givenFeedBackArray = [3, 3, 6, 7];
let correlation1 = correlation(feedbackArray, givenFeedBackArray);
console.log(correlation1);
