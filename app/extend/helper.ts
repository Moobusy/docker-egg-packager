export default {
    apiSuccess(content = {}) {
        return {
            state: 'Success',
            content: {
                state: 'Success',
                content,
                msg: '业务成功',
            },
        };
    },
    apiError(msg = '') {
        return {
            state: 'Success',
            content: {
                state: 'Fail',
                msg,
            },
        };
    },
};
