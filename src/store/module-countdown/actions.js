export function tick({ state, commit, getters }) {
    if (!getters.isCheckingPoint) commit('checking');

    const isWorking = state.working && getters.isWorkingPeriod;
    const isBreakingWorkTime = !state.working && getters.isWorkingPeriod;
    const isBreaking = !state.working && getters.isBreakPeriod;
    const isBreakingBreakTime = state.working && getters.isBreakPeriod;

    switch (true) {
        case isWorking:
        case isBreaking:
            commit('counting');
            break;
        case isBreakingWorkTime:
            commit('resetBreak');
            break;
        case isBreakingBreakTime:
        default:
            break;
    }
}
