export const isPossible = (valuesArray, sum, target) => {
  if(sum === target) {
    return true;
  }
  if(sum > target) {
    return false;
  }
  for(let i = 0; i < valuesArray.length; i++) {
    let remainingValues = valuesArray.slice(0); // copy
    remainingValues.splice(i,1);
    if(isPossible(remainingValues, sum + valuesArray[i], target)) {
      return true;
    }
  }
  return false;
};

export const canSelectNumbers = (selectedNumbers, total) => (
  sumArray([...selectedNumbers]) === total
);

export const possibleChoices = [...Array(9).keys()].map(i => i + 1);

export const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);