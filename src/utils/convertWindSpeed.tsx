export function convertWindSpeed(speedInMeters:number):string{
    const speedInKiloMeters=speedInMeters*3.6;
    return `${speedInKiloMeters.toFixed(0)}km/h`;
}