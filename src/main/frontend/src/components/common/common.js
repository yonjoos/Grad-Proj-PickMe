// 너무 긴 제목이나 닉네임이면 적당한 길이로 자르고, ... 붙이기
export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

// 2023826 -> 2023년 8월 26일 형식으로 변환
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

// 2023/8/26-11:11분을 2023년 8월 26일 11시 11분 형식으로 변환
export const formatDateTime = (dateTimeArray) => {
  if (!Array.isArray(dateTimeArray)) {
    // dateTimeArray가 배열이 아닌 경우 오류 처리
    return "Invalid date and time format";
  }
  const [year, month, day, hours, minutes] = dateTimeArray;
  const date = new Date(year, month - 1, day, hours, minutes);

  // 년, 월, 일, 시간, 분 형식으로 포맷팅
  const formattedYear = date.getFullYear();
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0"); // 월을 2자리로 표현
  const formattedDay = date.getDate().toString().padStart(2, "0"); // 일을 2자리로 표현
  const formattedHours = date.getHours().toString().padStart(2, "0"); // 시를 2자리로 표현
  const formattedMinutes = date.getMinutes().toString().padStart(2, "0"); // 분을 2자리로 표현

  const formattedDateTime = `${formattedYear}.${formattedMonth}.${formattedDay}. ${formattedHours}:${formattedMinutes}`;

  return formattedDateTime;
};
