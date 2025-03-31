export function sleep(time = 2000) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}

// 格式化日期
export function formatDateTime(date) {
	const now = new Date();
	const targetDate = new Date(date);
	const diffTime = now.getTime() - targetDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
	const hours = targetDate.getHours().toString().padStart(2, "0");
	const minutes = targetDate.getMinutes().toString().padStart(2, "0");
	const timeStr = `${hours}:${minutes}`;
  
	if (diffDays === 0) {
	  return `今天 ${timeStr}`;
	} else if (diffDays === 1) {
	  return `昨天 ${timeStr}`;
	} else if (diffDays === -1) {
	  return `明天 ${timeStr}`;
	} else {
	  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
	  const day = targetDate.getDate().toString().padStart(2, "0");
	  return `${month}-${day} ${timeStr}`;
	}
  }