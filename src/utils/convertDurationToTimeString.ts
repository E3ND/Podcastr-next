export function convertDurationToTimeString (duration: number) {
    const hour = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const timeString = [hour, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) //Se na hora tiver só um numero ele adicona um 0 a frente
    .join(':')

    return timeString;
}