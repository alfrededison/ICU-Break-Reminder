export const setNotificationSound = (state, path) => {
    state.notification = new Audio(path);
}

export const setAlarmSound = (state, path) => {
    state.alarm = new Audio(path);
}
