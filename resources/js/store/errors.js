

const state={
    errors: null,
    success: null,
    loading: false
};
const actions={

};
const getters={
    errors: state => state.errors,
    success: state => state.success,
    loading: state => state.loading,
};
const mutations={
    setErrors(state, data) {
        state.errors=data
    },
    setSuccess(state, data) {
        state.success=data
    },
    setLoading(state, data) {
        state.loading=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
