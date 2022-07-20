const reverseString = (_str: string, sep: string) => {
  let arr = _str.split(sep);
  arr = arr.reverse();
  return arr.join(sep);
};

reverseString("Abra Kadabra", "");