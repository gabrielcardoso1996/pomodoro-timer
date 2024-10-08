// import { useForm } from "react-hook-form";
// import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// const newCycleValidationSchema = z.object({
//   task: z.string().min(1, { message: "Informe a tarefa" }),
//   minutesAmount: z
//     .number()./components/NewCycleForm
//     .int()
//     .min(1, {
//       message: "Mínimo de 5 minutos por ciclo",
//     })
//     .max(60, {
//       message: "Máximo de 60 minutos por ciclo",
//     }),
// });
// type NewCycleFormData = z.infer<typeof newCycleValidationSchema>;

// export function NewCycleForm() {
//   const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
//     resolver: zodResolver(newCycleValidationSchema),
//     defaultValues: {
//       task: "",
//       minutesAmount: 0,
//     },
//   });

//   return (
//     <FormContainer>
//       <label htmlFor="task">Vou trabalhar em </label>
//       <TaskInput
//         type="text"
//         id="task"
//         placeholder="Dê um nome para o seu projeto"
//         list="task-suggestion"
//         disabled={!!activeCycle}
//         {...register("task")}
//       />
//       <datalist id="task-suggestion">
//         <option value="Projeto 1" />
//         <option value="Projeto 2" />
//         <option value="Projeto 3" />
//       </datalist>
//       <label htmlFor="minutesAmount">durante</label>
//       <MinutesAmountInput
//         type="number"
//         id="minutesAmount"
//         placeholder="00"
//         step={1}
//         min={0}
//         max={60}
//         disabled={!!activeCycle}
//         {...register("minutesAmount", {
//           valueAsNumber: true,
//         })}
//       />
//       <span>minutos.</span>
//     </FormContainer>
//   );
// }
