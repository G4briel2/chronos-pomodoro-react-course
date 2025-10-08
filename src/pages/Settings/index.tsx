import { SaveIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";
import { useEffect, useRef } from "react";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionsTypes } from "../../contexts/TaskContext/taskActions";

export function Settings() {

    useEffect(() => {
        document.title = 'Configurações - Chronos Pomodoro'
    }, [])

    const { state, dispatch } = useTaskContext();
    

    const workInput = useRef<HTMLInputElement>(null);
    const shortBreakInput = useRef<HTMLInputElement>(null);
    const longBreakInput = useRef<HTMLInputElement>(null);


    function handleSaveSettings(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        showMessage.dissmiss();

        const formErrors = []

        const workTime = Number(workInput.current?.value);
        const shortBreakTime = Number(shortBreakInput.current?.value);
        const longBreakTime = Number(longBreakInput.current?.value);

        if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)){
            formErrors.push('Digite apenas números para todos os campos');
        }

        if (workTime < 1 || workTime > 99){
            formErrors.push('Digite valores entre 1 e 99 para foco');
        }

        if (shortBreakTime < 1 || shortBreakTime > 30){
            formErrors.push('Digite valores entre 1 e 30 para descanso curto');
        }

        if (longBreakTime < 1 || longBreakTime > 60){
            formErrors.push('Digite valores entre 1 e 60 para descanso curto');
        }

        if (formErrors.length > 0){
            formErrors.forEach(error => {
                showMessage.error(error);
            }) 
            return;
        }

        dispatch({ type: TaskActionsTypes.CHANGE_SETTINGS, payload: {
            workTime,
            shortBreakTime,
            longBreakTime
        }});

        showMessage.success('Configurações salvas');
    }

    return (
        <MainTemplate>
            <Container>
                <Heading>Configurações</Heading>
            </Container>

            <Container>
                <p style={{ textAlign: 'center' }}>Modifique as configurações para tempo de foco, descanso curto e descanso longo</p>
            </Container>

            <Container>
                <form onSubmit={handleSaveSettings} action="" className="form">
                    <div className="formRow">
                        <DefaultInput id="workTime" labelText="Foco" ref={workInput} defaultValue={state.config.workTime} type="number"/>
                    </div>
                    <div className="formRow">
                        <DefaultInput id="shortBreakTime" labelText="Descanso curto" ref={shortBreakInput} defaultValue={state.config.shortBreakTime} type="number"/>
                    </div>
                    <div className="formRow">
                        <DefaultInput id="longBreakTime" labelText="Descanso longo" ref={longBreakInput} defaultValue={state.config.longBreakTime} type="number"/>
                    </div>

                    <div className="formRow">
                        <DefaultButton icon={<SaveIcon/>} aria-label="Salvar configurações" title="Salvar configurações" />
                    </div>
                </form>
            </Container>
        </MainTemplate>
    )
}