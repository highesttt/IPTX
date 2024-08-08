export function getFlagEmoji(countryCode: string) {
  var code = countryCode.replace(/[^a-zA-Z]/g, '');
  if (!code) {
    return countryCode;
  }
  if (code.toUpperCase() === 'EN' || code.toUpperCase() === 'ENG' || code.toUpperCase() === 'US') {
    code = 'US';
  }
  if (code.toUpperCase() === 'IND') {
    code = 'IN';
  }
  if (code.toUpperCase() === 'IRL') {
    code = 'IE';
  }
  if (code.toUpperCase() === 'AFG') {
    code = 'AF';
  }
  if (code.toUpperCase() === 'HV') {
    code = 'VN';
  }
  if (code.toUpperCase() === 'AR') {
    code = 'SA';
  }
  if (code.toUpperCase() === 'UK') {
    code = 'GB';
  }
  if (code.toUpperCase() === 'KO') {
    code = 'KR';
  }
  if (code.toUpperCase() === 'AM') {
    return '🌎';
  }
  if (code.toUpperCase() === 'AS') {
    return '🌏';
  }
  if (code.toUpperCase() === 'XX') {
    return '🔞';
  }
  // if it contains numbers
  if (/\d/.test(countryCode)) {
    return countryCode;
  }
  if (code.length > 2 && (code.toUpperCase().indexOf('MULTI') > -1 || code.toUpperCase().indexOf('WORLD') > -1)) {
    return '🌐'
  } else if (code.length > 2 && (code.toUpperCase().indexOf('MULTI') == -1 || code.toUpperCase().indexOf('WORLD') == -1)) {
    return countryCode
  }
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}