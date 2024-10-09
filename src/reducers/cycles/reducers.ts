import { ActionTypes } from "./actions";
import { produce } from "immer";

interface CyCleState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function cyclesReducers(state: CyCleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_CYCLE:
      //copiar todos os ciclos existente e adicionar um novo ciclo
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload.newCycle],
      //   activeCycleId: action.payload.newCycle.id,
      // };

      // eu consigo trabalhar com o state de forma imutável
      // o immer é uma biblioteca que facilita a manipulação de objetos
      // de forma imutável
      return produce(state, (draft) => {
        // draft é uma cópia do state
        // aqui usamos o push para adicionar um novo ciclo, um método multável que não é recomendado no react, mas o immer faz isso de forma segura
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      //   return {
      //     ...state,
      //     cycles: state.cycles.map((cycle) => {
      //       if (cycle.id === state.activeCycleId) {
      //         return {
      //           ...cycle,
      //           interruptedDate: new Date(),
      //         };
      //       } else {
      //         return cycle;
      //       }
      //     }),
      //     activeCycleId: null,
      //   };
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );
      if (currentCycleIndex < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     if (cycle.id === action.payload.activeCycleId) {
      //       return {
      //         ...cycle,
      //         finishedDate: new Date(),
      //       };
      //     } else {
      //       return cycle;
      //     }
      //   }),
      //   activeCycleId: null,
      // };
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId
      );
      if (currentCycleIndex < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].finishedDate = new Date();
      });
    }
    default:
      return state;
  }
}
