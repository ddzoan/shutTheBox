import {isPossible, canSelectNumbers, possibleChoices, sumArray} from "../gameHelpers";

describe('gameHelpers', function () {
  describe('isPossible', function () {
    it('should be true when sum is the target', function () {
      expect(isPossible([1], 1, 1)).toEqual(true);
    });

    it('should be false when the sum is higher than the target', function () {
      expect(isPossible([1,2], 3, 1)).toEqual(false);
    });

    it('should pass test cases', function () {
      expect(isPossible([1,2,3], 0, 1)).toEqual(true);
      expect(isPossible([1,2,3], 0, 2)).toEqual(true);
      expect(isPossible([1,2,3], 0, 3)).toEqual(true);
      expect(isPossible([1,2,3], 0, 4)).toEqual(true);
      expect(isPossible([1,2,3], 0, 5)).toEqual(true);
      expect(isPossible([1,2,3], 0, 6)).toEqual(true);
      expect(isPossible([1,2,3], 0, 7)).toEqual(false);

      expect(isPossible([1,2,5], 0, 4)).toEqual(false);
      expect(isPossible([1,2,5], 0, 9)).toEqual(false);
    });
  });

  describe('canSelectNumbers', function () {
    it('should be true when sum of selected numbers equals total', function () {
      expect(canSelectNumbers([1], 1)).toEqual(true);
      expect(canSelectNumbers([1,2], 3)).toEqual(true);
      expect(canSelectNumbers([1,2,3], 6)).toEqual(true);
      expect(canSelectNumbers([1,2,3,4], 10)).toEqual(true);
    });
    it('should be false when sum of selected numbers does not equal total', function () {
      expect(canSelectNumbers([1], 2)).toEqual(false);
      expect(canSelectNumbers([1,2], 4)).toEqual(false);
      expect(canSelectNumbers([1,2,3], 5)).toEqual(false);
      expect(canSelectNumbers([1,2,3,4], 3)).toEqual(false);
    });
  });

  describe('possibleChoices', function () {
    it('should be an array from 1 - 9', function () {
      expect(possibleChoices).toEqual([1,2,3,4,5,6,7,8,9]);
    });
  });

  describe('sumArray', function () {
    it('should sum the array', function () {
      expect(sumArray([1,2])).toEqual(3);
      expect(sumArray([1,2,3])).toEqual(6);
      expect(sumArray([-2, 2])).toEqual(0);
      expect(sumArray([1,2,3,4,5])).toEqual(15);
      expect(sumArray([-1,-2])).toEqual(-3);
    });
  });
});