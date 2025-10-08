import { PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { DefaultButton } from "../DefaultButton";
import { Cycles } from "../Cycles";
import { DefaultInput } from "../DefaultInput";
import { useRef } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";
import { TaskActionsTypes } from "../../contexts/TaskContext/taskActions";
import { Tips } from "../Tips";
import { showMessage } from "../../adapters/showMessage";

export function MainForm() {
    const { state, dispatch } = useTaskContext();

    const taskNameInput = useRef<HTMLInputElement>(null);

    const lastTaskName = state.tasks[state.tasks.length - 1]?.name || '';

    //ciclos
    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        showMessage.dissmiss();

        if(taskNameInput.current === null) return;

        const taskName = taskNameInput.current.value.trim();
        if(!taskName){
            showMessage.warning('Digite o nome da tarefa');
            return;
        }

        const newTask: TaskModel = {
            id: Date.now().toString(),
            name: taskName,
            startDate: Date.now(),
            completeDate: null,
            interruptDate: null,
            duration: state.config[nextCycleType],
            type: nextCycleType,
        };

        dispatch({ type: TaskActionsTypes.START_TASK, payload: newTask });
        
       
        showMessage.success("Tarefa iniciada");
    };

    function handleInterruptTask(){
        showMessage.dissmiss();
        showMessage.error("Tarefa interrompida")
        dispatch({ type: TaskActionsTypes.INTERRUPT_TASK });
    }

    return (
        <form onSubmit={handleCreateNewTask} className='form' action="">
            <div className="formRow">
                <DefaultInput
                labelText='task'
                id='input'
                type='text'
                placeholder='Digite algo...'
                ref = {taskNameInput}
                disabled={!!state.activeTask}
                defaultValue={lastTaskName}
                />
                
            </div>

            <div className="formRow">
                <Tips />
            </div>

            {state.currentCycle > 0 && (
                <div className="formRow">
                    <Cycles/>
                </div>
            )}

            <div className="formRow">
                {!state.activeTask && (
                    <DefaultButton
                        aria-label="Iniciar nova tarefa"
                        title="Iniciar nova tarefa"
                        type="submit"
                        icon={<PlayCircleIcon/>}
                        key='botao_submit'
                    />
                )} 
                    
                {state.activeTask &&( 
                    <DefaultButton
                        aria-label="Interromper tarefa atual"
                        title="Interromper tarefa atual"
                        type="button"
                        color="red"
                        icon={<StopCircleIcon/>}
                        onClick={handleInterruptTask}
                        key='botao_button'
                    />
                )}
                
            </div>
        </form>
    );
}