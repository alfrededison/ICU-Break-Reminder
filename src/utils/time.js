const getLastTimeDigitFromString = (str) => {
    if (str.length >= 2) {
        const time = Number.parseInt(str.substr(-2, 2));
        const left = str.substring(0, str.length - 2);
        return { time, left };
    }
    if (str.length === 1) {
        const time = Number.parseInt(str);
        return { time, left: '' };
    }
}

export const convertDurationStringToSeconds = (duration) => {
    let time = 0;

    let results = getLastTimeDigitFromString(duration);
    time += results.time; //seconds
    if (results.left.length === 0) return time;

    results = getLastTimeDigitFromString(results.left);
    time += results.time * 60;  //minutes
    if (results.left.length === 0) return time;

    results = getLastTimeDigitFromString(results.left);
    time += results.time * 3600;  //hours
    return time;
}
