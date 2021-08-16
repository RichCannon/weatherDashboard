
import { LocationT } from '../types/types'

export const distanceBetween2Dots = (mk1: LocationT, mk2: LocationT) => {
   const R = 6371.071; // Radius of the Earth in kilometrs
   const rlat1 = mk1.lan * (Math.PI / 180); // Convert degrees to radians
   const rlat2 = mk2.lan * (Math.PI / 180); // Convert degrees to radians
   const difflat = rlat2 - rlat1; // Radian difference (latitudes)
   const difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)
   return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2)
      * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2)
      * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
}

export function debounce<F extends Function>(func:F, wait:number):F {
   let timeoutID:number;
 
   if (!Number.isInteger(wait)) {
     wait = 300;
   }
   // conversion through any necessary as it wont satisfy criteria otherwise
   return <any>function(this:any, ...args: any[]) {
       clearTimeout(timeoutID);
       const context = this;
 
       timeoutID = window.setTimeout(function() {
           func.apply(context, args);
       }, wait);
    };
 };