const state={
    roles: [],
    aspects: [],
    resolutions: [],
    users_list: [],
};
const actions={

    getSuperadminResources({commit}){
        axios.get("/api/getSuperadminResources")
        .then(response=>{
            commit("setRoles", response.data.roles);
            commit("setAspects", response.data.aspects);
            commit("setResolutions", response.data.resolutions);
            commit("setUsersList", response.data.users_list);
        })
        .catch(function(error) {
            if (error.response || error.response.status === 401) {
                dispatch('currentUser/logoutUser', null, { root: true });
                if (error.response.status == 422){
                    commit("errors/setErrors", error.response.data.errors, { root: true });
                 }
                 else{
                     commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
                 }
        }})
    },
    addRole({commit,  dispatch}, role_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addRole", {
            name: role_form.name,
        })
        .then(response=>{
            dispatch("getSuperadminResources");
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
        })
    },
    addAspect({commit, dispatch}, aspect_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addAspect", {
            name: aspect_form.name,
        })
        .then(response=>{
            dispatch("getSuperadminResources");
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
        })
    },
    addResolution({commit, dispatch}, resolution_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addResolution", {
            width: resolution_form.width,
            height: resolution_form.height,
            aspect: resolution_form.aspect,
        })
        .then(response=>{
            dispatch("getSuperadminResources");
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
        })
    },
};
const getters={
    roles: state => state.roles,
    aspects: state => state.aspects,
    resolutions: state => state.resolutions,
    usersList: state => state.users_list,
};
const mutations={
    setUsersList(state, data) {
        state.users_list=data
    },
    setRoles(state, data) {
        state.roles=data
    },
    setAspects(state, data) {
        state.aspects=data
    },
    setResolutions(state, data) {
        state.resolutions=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
