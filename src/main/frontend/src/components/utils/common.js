// 너무 긴 제목이나 닉네임이면 적당한 길이로 자르고, ... 붙이기
export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};
