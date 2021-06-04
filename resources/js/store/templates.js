import router from '../router'

const state={
    selectedTemplatesWatcher: "my",
    selectedTemplates:[],
    myTemplates: [],
    otherTemplates: [],
    currentTemplate: null,
    paginationDetails: {
        lenght: 0,
        page: 0
    }
};
const actions={
    getTemplates({commit, state, dispatch}){
        axios.get("/api/getTemplates?page=" + state.paginationDetails.page)
        .then(response=>{
            commit("superadmin/setAspects", response.data.aspects_list, { root: true });
            commit("superadmin/setUsersList", response.data.users_list, { root: true });
            commit("backgrounds/setBackgroundsList", response.data.backgrounds_list, { root: true });
            if(response.data.my_templates==null){
                state.selectedTemplatesWatcher="other";
            }
            commit("setOtherTemplates", response.data.other_templates);
            if(state.selectedTemplatesWatcher=="my"){
                commit("setSelectedTemplates", response.data.my_templates);
            }
            else if(state.selectedTemplatesWatcher=="other"){
                commit("setSelectedTemplates", response.data.other_templates);
            }
            if(state.currentTemplate==null){
                commit("setCurrentTemplate", response.data.current_template);
            }
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

    selectTemplates({commit}, templates){
            commit("setSelectedTemplates", templates);
    },
    addTemplate({commit, dispatch}, template_form){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addTemplate", {
            name: template_form.name,
            user: template_form.user,
            max_matches: template_form.max_matches,
            aspect: template_form.aspect,
        })
        .then(response=>{
            dispatch("getTemplates");
            commit("errors/setSuccess", "Predložak uspješno dodan.", { root: true });
            commit("errors/setLoading", false, { root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                console.log(error.response.data.errors);
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
             commit("errors/setLoading", false, { root: true });
        })
    },

    deleteTemplate({commit, dispatch}, template){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteTemplate", {
            template_id: template,
        })
        .then(response=>{
            dispatch("getTemplates");
            commit("errors/setSuccess", "Predložak uspješno izbrisan.", { root: true });
            commit("errors/setLoading", false, { root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
             commit("errors/setLoading", false, { root: true });
        })
    },

    editTemplate({commit, dispatch}, edit_form){
        commit("errors/setLoading", true, { root: true });
        let form = new FormData();
        form.append('id', edit_form.id);
        form.append('name', edit_form.name);
        form.append('user', edit_form.user);
        form.append('max_matches', edit_form.max_matches);
        form.append('aspect', edit_form.aspect);
        form.append('example_image', edit_form.example_image);
        form.append('default_background', edit_form.default_background);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/editTemplate", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
        .then(response=>{
            dispatch("getTemplates");
            commit("errors/setSuccess", "Predložak uspješno uređen.", { root: true });
            commit("errors/setLoading", false, { root: true });
        })
        .catch((error) => {
            if (error.response.status == 422){
                commit("errors/setErrors", error.response.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
             commit("errors/setLoading", false, { root: true });
        })
    },

    currentTemplate({commit}, template){
        commit("setCurrentTemplate", template);
        router.push({path: template.url});
    },

};
const getters={
    selectedTemplates: state => state.selectedTemplates,
    myTemplates: state => state.myTemplates,
    otherTemplates: state => state.otherTemplates,
    currentTemplate: state => state.currentTemplate,
    paginationDetails: state => state.paginationDetails,
    selectedTemplatesWatcher: state => state.selectedTemplatesWatcher,

};
const mutations={
    setSelectedTemplates(state, data) {
        state.selectedTemplates=data;
        if(state.selectedTemplates==state.otherTemplates){
            state.selectedTemplatesWatcher="other";
        }
        else{
            state.selectedTemplatesWatcher="my";
        }
        if(data==null){
            state.paginationDetails.page=0;
            state.paginationDetails.lenght=0;
        }
        else{
            state.paginationDetails.page=data.current_page;
            state.paginationDetails.lenght=data.last_page;
        }
    },
    setMyTemplates(state, data) {
        state.myTemplates=data;
    },
    setOtherTemplates(state, data) {
        state.otherTemplates=data
    },
    setCurrentTemplate(state, data) {
        state.currentTemplate=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
