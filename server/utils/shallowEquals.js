/**
 * Compares two arrays for first-level equality, disregarding different indexes.
 * Doesn't handle nesting. Doesn't deal with repeated values.
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Boolean}
 */
exports.shallowEquals = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  let set2 = new Set(arr2);
  for (let val of arr1) {
    if (!set2.has(val)) {
      return false;
    }
  }
  return true;
};