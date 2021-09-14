export const notify = ({state}) =>{
    state.notification.play();
}

export const alert = ({state}) => {
    state.alarm.loop = true;
    state.alarm.play();
}

export const stopAlert = ({state}) => {
    state.alarm.pause();
}

export const testAlert = ({state}) => {
    state.alarm.loop = false;
    state.alarm.play();
}
