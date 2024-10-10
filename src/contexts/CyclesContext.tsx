import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Cycle, cyclesReducers } from "../reducers/cycles/reducers";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CycleContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProvider {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CycleContextType);

export function CyclesContextProvider({ children }: CyclesContextProvider) {
  //dois parametros
  // state - valor atual, em tempo real
  //action - indica qual ação que será executada para atualizar o estado

  //dispatchCycle - função que será chamada para atualizar o estado
  // a gente vai utilizar mais o useReducer do que o useState quando a gente tem um estado que é mais complexo
  // e que a gente precisa de mais de uma ação para atualizar esse estado

  // initialState - valor inicial do estado
  //useReducer = useState + dispatch, useReducer(state, action, initialState)
  const [cyclesState, dispatchCycle] = useReducer(
    cyclesReducers,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storageState = localStorage.getItem("@pomodoro:cycles-1.0.0");
      if (storageState) {
        return JSON.parse(storageState);
      }
      return initialState;
    }
  );

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle: Cycle) => cycle.id === activeCycleId);
  const [amountSecondPassed, setAmountSecondPassed] = useState(() => {
    return differenceInSeconds(
      new Date(),
      new Date(activeCycle?.startDate || 0),
    );
  });

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState);
    //versionamento - caso eu preciso mudar a estrutura do meu estado, eu posso versionar e ver se o estado antigo é compatível com o novo
    localStorage.setItem("@pomodoro:cycles-1.0.0", stateJson);
  }, [cyclesState]);

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

    //setCycles((state) => [...state, newCycle]);
    dispatchCycle(addNewCycleAction(newCycle));
    setAmountSecondPassed(0);
  }

  function interruptCurrentCycle() {
    document.title = "Pomodoro";
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return {
    //         ...cycle,
    //         interruptedDate: new Date(),
    //       };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
    dispatchCycle(interruptCurrentCycleAction());
  }

  function markCurrentCycleAsFinished() {
    dispatchCycle(markCurrentCycleAsFinishedAction());
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return {
    //         ...cycle,
    //         finishedDate: new Date(),
    //       };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
  }

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
