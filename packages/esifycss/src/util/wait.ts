export const wait = async (duration: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};
