

export const validInterval = (interval: string):boolean => {
    const validIntervals = ['day','week','month','year'];
    return !!validIntervals.indexOf(interval);
}
