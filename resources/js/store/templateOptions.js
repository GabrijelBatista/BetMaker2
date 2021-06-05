const state={
    resolution: null,
    template_resolutions: null,
};
const actions={
    getTemplateResolutions({commit}, aspect_id){
        axios.post("/api/getTemplateResolutions", {
            aspect_id: aspect_id,
        })
        .then(response=>{
            commit("setTemplateResolutions", response.data.template_resolutions);
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
    changeResolution({commit}, resolution_form){
        let form = new FormData();
        form.append('width', resolution_form.width);
        form.append('height', resolution_form.height);
        form.append('aspect_id', resolution_form.aspect_id);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/changeResolution", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
        .then(response=>{
            commit("setResolution", response.data.current_resolution);
            return response.data.current_resolution;
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
    resolution: state => state.resolution,
    templateResolutions: state => state.template_resolutions,
};
const mutations={
    setResolution(state, data) {
        state.resolution=data;
    },
    setTemplateResolutions(state, data) {
        state.template_resolutions=data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
