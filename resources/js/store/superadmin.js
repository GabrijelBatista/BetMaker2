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
    },
    addRole({commit}, role_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addRole", {
            name: role_form.name,
        })
        .then(response=>{
            commit("setRoles", response.data.roles);
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
            commit("errors/setSuccess", false, { root: true });
        })
    },
    addAspect({commit}, aspect_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addAspect", {
            name: aspect_form.name,
        })
        .then(response=>{
            commit("setAspects", response.data.aspects);
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
            commit("errors/setSuccess", false, { root: true });
        })
    },
    addResolution({commit}, resolution_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addResolution", {
            width: resolution_form.width,
            height: resolution_form.height,
            aspect: resolution_form.aspect,
        })
        .then(response=>{
            commit("setResolutions", response.data.resolutions);
            commit("errors/setSuccess", "Uspješno dodano.", { root: true });
            commit("errors/setErrors", null,{ root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
            commit("errors/setSuccess", false, { root: true });
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
