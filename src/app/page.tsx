'use client'



import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelcius } from "@/utils/convertKelvinToCelcius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { mToKm } from "@/utils/mToKm";
import WeatherDetails from "@/components/WeatherDetails";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { useAtom } from 'jotai';
import { placeAtom } from '@/app/atom';
import { useEffect } from "react";





// https://api.openweathermap.org/data/2.5/forecast?q=panipat&appid=9cecd26c9fca083a86128e5994e7d9f7&cnt=2


interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface WeatherData {
  dt: number;
  main: MainWeatherData;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface WeatherApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: City;
}


export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);

  const { isPending, error, data,refetch } = useQuery<MainWeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.WEATHER_KEY}&cnt=56`);
      return data;
    }
  })

  useEffect(()=>{
    refetch();
  },[place,refetch])



  if (isPending) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">Loading...</p>
    </div>)


  const firstData = data?.list[0]


  console.log(data)
  //console.log(data.city.name)

  const uniqueDates=[
    ...new Set(
      data?.list.map(
        (entry)=>new Date(entry.dt *1000).toISOString().split("T")[0]
      )
    )
  ];

  const FirstDataForEachDate=uniqueDates.map((date)=>{
    return data?.list.find((entry)=>{
      const entryDate=new Date(entry.dt*1000).toISOString().split("T")[0];
      const entryTime=new Date(entry.dt*1000).getHours();
      return entryDate===date && entryTime>=6
    })
  })

  return (
    <div className="flex flex-col gap-4 bg-[#0a1526] min-h-screen">
      <Navbar location={data?.city.name}/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="text-white">{format(parseISO(firstData?.dt_txt ?? ''), "EEEE")}</p>
              <p className="text-white text-lg">({format(parseISO(firstData?.dt_txt ?? ''), "dd.MM.yyyy")})</p>
              {/* <p className="text-white">
                {firstData?.dt_txt ? format(parseISO(firstData.dt_txt), "EEEE") : 'Invalid Date'}
              </p>
              <p className="text-white text-lg">
                {firstData?.dt_txt ? format(parseISO(firstData.dt_txt), "dd.MM.yyyy") : 'Invalid Date'}
              </p> */}

            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelcius(firstData?.main.temp)}&deg;
                </span>
                <p className="text-xs spaxe-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToCelcius(firstData?.main.temp)}&deg;
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelcius(firstData?.main.temp_min)}&deg;&darr;
                  </span>
                  <span>
                    {convertKelvinToCelcius(firstData?.main.temp_max)}&deg;&uarr;
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, index) => (
                  <div key={index} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), 'h:mm a')}
                    </p>
                    {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                    <p>{convertKelvinToCelcius(d?.main.temp)}&deg;</p>
                  </div>
                ))}
              </div>

            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData.weather[0].description}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData.weather[0].icon, firstData.dt_txt)} />
            </Container>
            <Container className="px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails visability={mToKm(firstData?.visability ?? 10000)} airPressure={`${firstData?.main.pressure} hPa`} humidity={`${firstData?.main.humidity}%`} sunrise={format(fromUnixTime(data?.city.sunrise ??
                1712881731), "H:mm")} sunset={format(fromUnixTime(data?.city.sunset ??
                  1712927787), "H:mm")} windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}/>
            </Container>
          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl text-white">Forecast (7days)</p>
          {FirstDataForEachDate.map((d,i)=>(
                <ForecastWeatherDetail key={i} 
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""),"dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""),"EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  visability={mToKm(d?.visability ?? 10000)} 
                  airPressure={`${d?.main.pressure} hPa`} 
                  humidity={`${d?.main.humidity}%`} 
                  sunrise={format(fromUnixTime(data?.city.sunrise ??
                    1712881731), "H:mm")} 
                  sunset={format(fromUnixTime(data?.city.sunset ??
                      1712927787), "H:mm")} 
                  windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}

                />
          ))}
          
        </section>
      </main>
    </div>
  );
}
