import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInSeconds } from "date-fns";
import {
  FormContainer,
  MinutesAmountInput,
  TaskInput,
} from "./components/NewCycleForm/styles";

// infer - pega o tipo do schema automaticamente, sem precisar definir, especifico do typescript
// typeof - sempre que eu quiser pegar o tipo de uma variavel JS, eu uso typeof
const newCycleValidationSchema = z.object({
  task: z.string().min(1, { message: "Informe a tarefa" }),
  minutesAmount: z
    .number()
    .int()
    .min(5, {
      message: "Mínimo de 5 minutos por ciclo",
    })
    .max(60, {
      message: "Máximo de 60 minutos por ciclo",
    }),
});
type NewCycleFormData = z.infer<typeof newCycleValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const [amountSecondPassed, setAmountSecondPassed] = useState(0);
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsPassed = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsPassed >= totalSeconds) {
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
          clearInterval(interval);
          setAmountSecondPassed(totalSeconds);
        } else {
          setAmountSecondPassed(secondsPassed);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    setAmountSecondPassed(0);
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

  return (
    <HomeContainer>
      <form
        onSubmit={handleSubmit(handleCreateNewCycle)}
        action=""
        method="post"
      >
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em </label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestion"
            disabled={!!activeCycle}
            {...register("task")}
          />
          <datalist id="task-suggestion">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={0}
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", {
              valueAsNumber: true,
            })}
          />
          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm width={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play width={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
