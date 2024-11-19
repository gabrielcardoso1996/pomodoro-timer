import { createContext, useContext, useState } from "react";

const CyclesContext = createContext({
} as any);

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext);
  return (
    <div>
      <h1>New cycle form: {activeCycle}</h1>
      <button type="button" onClick={() => {setActiveCycle(activeCycle + 1)}}>Novo ciclo</button>
    </div>
  );
}

function Countdown () {
  const { activeCycle } = useContext(CyclesContext);
  return <h1>Coutdown: {activeCycle} </h1>;
}


export function Home() {
  const [activeCycle, setActiveCycle] = useState(0);

  return (
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      <NewCycleForm />
      <Countdown />
    </CyclesContext.Provider>
  );
}
