const response = {
    err: (code: number, message: string) => ({error: {code, message}}),
    result: (data: any) => ({result: data})
};

export default response;