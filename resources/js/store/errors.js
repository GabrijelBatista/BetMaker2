

const state={
    errors: null,
    success: null,
};
const actions={

};
const getters={
    errors: state => state.errors,
    success: state => state.success,
};
const mutations={
    setErrors(state, data) {
        state.errors=data
    },
    setSuccess(state, data) {
        state.success=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
