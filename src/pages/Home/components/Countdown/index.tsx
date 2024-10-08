// import { useEffect, useState } from "react";
// import { CountdownContainer, Separator } from "./styles";
// import { differenceInSeconds } from "date-fns";

// export function Countdown() {
//   const [amountSecondPassed, setAmountSecondPassed] = useState(0);
//   const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0;
//   const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0;

//   const minutesAmount = Math.floor(currentSeconds / 60);
//   const secondsAmount = currentSeconds % 60;

//   const minutes = String(minutesAmount).padStart(2, "0");
//   const seconds = String(secondsAmount).padStart(2, "0");

//   useEffect(() => {
//     let interval: number;
//     if (activeCycle) {
//       interval = setInterval(() => {
//         const secondsPassed = differenceInSeconds(
//           new Date(),
//           activeCycle.startDate
//         );

//         if (secondsPassed >= totalSeconds) {
//           setCycles((state) =>
//             state.map((cycle) => {
//               if (cycle.id === activeCycleId) {
//                 return {
//                   ...cycle,
//                   finishedDate: new Date(),
//                 };
//               } else {
//                 return cycle;
//               }
//             })
//           );
//           clearInterval(interval);
//           setAmountSecondPassed(totalSeconds);
//         } else {
//           setAmountSecondPassed(secondsPassed);
//         }
//       }, 1000);
//     }
//     return () => {
//       clearInterval(interval);
//     };
//   }, [activeCycle, totalSeconds, activeCycleId]);

//   return (
//     <CountdownContainer>
//       <span>{minutes[0]}</span>
//       <span>{minutes[1]}</span>
//       <Separator>:</Separator>
//       <span>{seconds[0]}</span>
//       <span>{seconds[1]}</span>
//     </CountdownContainer>
//   );
// }
