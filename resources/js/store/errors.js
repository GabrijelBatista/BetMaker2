

const state={
    errors: null,
    success: null,
    loading: false
};
const actions={
    showError({commit}){
        commit("setErrors", "Odaberite ponuđene timove.");
    }
};
const getters={
    errors: state => state.errors,
    success: state => state.success,
    loading: state => state.loading,
};
const mutations={
    setErrors(state, data) {
        if(Array.isArray(data) || data==null){
            state.errors=data
        }
        else{
            var array=[];
            var array2=[];
            array2.push(data);
            array.push(array2);
            state.errors=array;
        }
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
