
export function mToKm(visabilityInMeters:number):string{
    const visabilityInKiloMeters=visabilityInMeters/1000;
    return `${visabilityInKiloMeters.toFixed(0)}km`;
}