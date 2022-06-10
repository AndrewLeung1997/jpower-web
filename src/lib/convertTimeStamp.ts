export function convertTimeStamp(timestamp: string | Date) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    const newDate = year + "-" + month + "-" + day;

    return newDate;
}
