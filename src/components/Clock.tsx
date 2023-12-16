import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function Clock(){

    const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(dayjs().format('HH:mm:ss'));
      }, 1000); // Update the time every second
  
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);
    return(
        <>
            {currentTime}
        </>
    )
}