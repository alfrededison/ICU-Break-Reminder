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

export function faceDetectedAction({ commit }) {
    commit('resetFaceMissingCounter');
    commit('working');
}

export function faceUndectectedAction({ state, commit, getters }) {
    if (getters.isWorkingPeriod && state.faceMissingCounter < DEFAULT_OPTIONS.faceMissingResetCount) {
        commit('increaseFaceMissingCounter');
    } else {
        commit('breaking');
    }
}
