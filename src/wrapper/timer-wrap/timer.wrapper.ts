import { useEffect } from "react"

const EZEntryChangeDetection = () =>{
  useEffect(()=>{
    setTimeout(() => {
      console.log("cont... 5second ")
    }, 5000);
  })
}

export default EZEntryChangeDetection