export function hasSetup(state) {
    return state.timeBetweenBreaks > 0
        && state.breakDuration > 0
        && state.notifyBefore > 0
        && state.timeBetweenChecks > 0
}

export function timeLeftBeforeBreak(state) {
    return state.timeBetweenBreaks - state.breakCounter
}

export function isWorkingPeriod(state) {
    return hasSetup(state) && timeLeftBeforeBreak(state) >= 0
}

export function isNotifyPeriod(state) {
    return isWorkingPeriod(state) && timeLeftBeforeBreak(state) <= state.notifyBefore
}

export function isBreakPeriod(state) {
    return hasSetup(state)
        && timeLeftBeforeBreak(state) < 0
        && timeLeftBeforeBreak(state) + state.breakDuration >= 0
}

export function timeLeftBeforeCheck(state) {
    return state.timeBetweenChecks - state.camCheckCounter
}

export function isCheckingPoint(state) {
    return hasSetup(state)
        && timeLeftBeforeCheck(state) < 0
}
