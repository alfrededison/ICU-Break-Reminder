import { DEFAULT_OPTIONS } from "src/utils/defaults";

export function tick({ dispatch, state, commit, getters }) {
    if (!getters.isCheckingPoint) commit('checking');

    const isWorking = state.working && getters.isWorkingPeriod;
    const isBreakingWorkTime = !state.working && getters.isWorkingPeriod;
    const isBreaking = !state.working && getters.isBreakPeriod;
    const isBreakingBreakTime = state.working && getters.isBreakPeriod;
    const isBackToWork = state.working && getters.isEndOfBreak;

    switch (true) {
        case isBreaking:
            dispatch('sounds/stopAlert', null, { root: true });
        case isWorking:
            commit('counting');
            break;
        case isBreakingWorkTime:
        case isBackToWork:
            commit('resetBreak');
            break;
        case isBreakingBreakTime:
            dispatch('sounds/alert', null, { root: true });
        default:
            break;
    }
}

export function humanDetectedAction({ commit }) {
    commit('resetHumanMissingCounter');
    commit('working');
}

export function humanUndectectedAction({ state, commit, getters }) {
    if (getters.isWorkingPeriod && state.humanMissingCounter < DEFAULT_OPTIONS.humanMissingResetCount) {
        commit('increaseHumanMissingCounter');
    } else {
        commit('breaking');
    }
}
