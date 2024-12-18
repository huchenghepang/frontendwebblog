import moment from 'moment';

/**
 * 计算给定日期与当前日期的关系
 * @param {string | moment.Moment} targetDate - 目标日期，可以是字符串或moment对象
 * @returns {string} - 返回类似 "X天之前", "X周之前", "X月之前", "X年之前", "X小时之前", "X分钟之前", "刚刚"
 */
export function timeAgo(targetDate: string | moment.Moment): string {
  const now = moment();
  const date = moment(targetDate);

  // 计算各个时间单位的差值
  const years = now.diff(date, 'years');
  const months = now.diff(date, 'months');
  const weeks = now.diff(date, 'weeks');
  const days = now.diff(date, 'days');
  const hours = now.diff(date, 'hours');
  const minutes = now.diff(date, 'minutes');
  const seconds = now.diff(date, 'seconds');

  // 根据时间差选择最合适的单位并返回
  if (years > 0) {
    return `${years} 年之前`;
  } else if (months > 0) {
    return `${months} 月之前`;
  } else if (weeks > 0) {
    return `${weeks} 周之前`;
  } else if (days > 0) {
    return `${days} 天之前`;
  } else if (hours > 0) {
    return `${hours} 小时之前`;
  } else if (minutes > 0) {
    return `${minutes} 分钟之前`;
  } else if (seconds >= 0 && seconds < 60) {
    return '刚刚';
  } else {
    return '刚刚'; // 如果是当前时间
  }
}