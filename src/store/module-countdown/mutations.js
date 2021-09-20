export function setup(state, payload) {
    state.breakCounter = 0;
    state.camCheckCounter = 0;
    state.timeBetweenBreaks = payload.timeBetweenBreaks;
    state.breakDuration = payload.breakDuration;
    state.notifyBefore = payload.notifyBefore;
    state.timeBetweenChecks = payload.timeBetweenChecks;
}

export function setEnable(state, value) {
    state.enable = value;
}

export function working(state) {
    state.working = true;
}

export function breaking(state) {
    state.working = false;
}

export function counting(state) {
    state.breakCounter++;
}

export function checking(state) {
    state.camCheckCounter++;
}

export function resetBreak(state) {
    state.breakCounter = 0;
}

export function resetChecking(state) {
    state.camCheckCounter = 0;
}

export function resetHumanMissingCounter(state) {
    state.humanMissingCounter = 0;
}

export function increaseHumanMissingCounter(state) {
    state.humanMissingCounter++;
}
