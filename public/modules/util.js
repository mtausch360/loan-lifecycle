
/**
 * Default testing function
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
function inRange(num, comparison){
  console.log("Expect ",num, ' between ', comparison - 1, comparison + 1 )
  return _.inRange(num, comparison - 1, comparison + 1);
}

export { inRange };
