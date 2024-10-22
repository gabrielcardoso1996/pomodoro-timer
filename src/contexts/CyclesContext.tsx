import { createContext, ReactNode, useContext, useState } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

export interface CycleContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

//Interface CyclesContextProvider: Define a estrutura para o provedor de contexto. O componente CyclesContextProvider 
//receberá children, que são os componentes React que ele envolverá.
interface CyclesContextProvider {
  children: ReactNode;
}

//Criação do Contexto: Cria o contexto CyclesContext com o tipo CycleContextType. Isso permitirá 
//compartilhar dados entre componentes sem passar props manualmente.
export const CyclesContext = createContext<CycleContextType>({} as CycleContextType);

export const useCycles = (): CycleContextType => useContext(CyclesContext);

//Provedor do Contexto: Função que serve como o provedor de dados. Envolverá componentes React filhos e 
// permitirá que eles acessem e manipulem os ciclos.
export function CyclesContextProvider({ children }: CyclesContextProvider) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondPassed, setAmountSecondPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondPassed(0);
  }

  function interruptCurrentCycle() {
    document.title = "Pomodoro";
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  // O provedor CyclesContext.Provider é configurado para expor o contexto (value) com todas as 
  //funções e dados gerenciados. Ele envolve os componentes filhos (children), permitindo que eles acessem o contexto
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}