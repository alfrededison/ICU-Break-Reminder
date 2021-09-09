export const save = data => {
    localStorage.setItem('configs', JSON.stringify(data));
}

export const load = () => {
    const data = localStorage.getItem('configs') || '{}';
    return JSON.parse(data);
}
