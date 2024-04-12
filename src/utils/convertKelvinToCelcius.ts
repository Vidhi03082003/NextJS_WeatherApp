
export function convertKelvinToCelcius(tempInKelvin:number):number{
    const tempCelcius=tempInKelvin-273.15;
    return Math.floor(tempCelcius)
}