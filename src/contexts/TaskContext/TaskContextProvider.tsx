import { useEffect, useReducer, useRef } from "react";
import { TaskContext } from "./TaskContext";
import { initialTaskState } from "./initialTaskState";
import { taskReducer } from "./taskReducer";
import { TimerWorkerManager } from "../../workers/timerWorkerManager";
import { TaskActionsTypes } from "./taskActions";
import { loadBeep } from "../../utils/loadBeep";
import type { TaskStateModel } from "../../models/TaskStateModel";

type TaskContextProviderProps = {
    children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps){

    const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
        const storageState = localStorage.getItem('state');

        if (storageState === null) return initialTaskState;

        const parseStorageState = JSON.parse(storageState) as TaskStateModel;

        return{
            ...parseStorageState,
            activeTask: null,
            secondsRemaining: 0,
            formattedSecondsRemaining: "00:00"
        };
    });

    const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

    const worker = TimerWorkerManager.getInstance();

    worker.onmessage(e => {
        const countDownSeconds = e.data;

        if(countDownSeconds <= 0) {
            if(playBeepRef.current){
                playBeepRef.current();
                playBeepRef.current = null;
            }
            dispatch({ type: TaskActionsTypes.COMPLETE_TASK});
        } else {
            dispatch({ type: TaskActionsTypes.COUNT_DOWN, payload: {secondsRemaining: countDownSeconds }});
        }
    });

    useEffect(() => {
        localStorage.setItem('state', JSON.stringify(state));

        if(!state.activeTask){
            worker.terminate();
        }

        document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`

        worker.postMessage(state);
    }, [worker, state]);

    useEffect(() => {
        if(state.activeTask && playBeepRef.current === null) {
            playBeepRef.current = loadBeep();
        } else {
            playBeepRef.current = null;
        }
    }, [state.activeTask])

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            { children }
        </TaskContext.Provider>
    );
}