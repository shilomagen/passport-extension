export const validateIsraeliIdNumber = (id: any): boolean => {
    if (!id) {
        return false;
    }
    id = String(id).trim();
    if (id.length !== 9 || isNaN(Number(id))) return false;
    return Array.from(id, Number).reduce((counter: number, digit: number, i: number) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
    }, 0) % 10 === 0;
};

export const validatePhoneNumber = (inputString: string): boolean => {
    const regex = /^05\d{8}$/;
    return regex.test(inputString);
};

export const validateNumberOfAllowedCities = (cities: string[] | null | undefined): boolean => {
    if (!cities || cities.length === 0) {
        return true;
    }
    return cities.length > 4;
};
