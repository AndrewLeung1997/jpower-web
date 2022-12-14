export function convertTime(num: number) {
    let minutes: string | number = Math.floor(num / 60);
    let seconds: string | number = Math.round(num % 60);

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    const timestamp = minutes + ":" + seconds;

    return timestamp;
}
