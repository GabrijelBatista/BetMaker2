import router from '../router'

const state={
    selectedTemplatesWatcher: "my",
    selectedTemplates: null,
    myTemplates: [],
    otherTemplates: [],
    currentTemplate: null
};
const actions={
    getTemplates({commit}){
        axios.get("/api/getTemplates")
        .then(response=>{
            commit("superadmin/setAspects", response.data.aspects_list, { root: true });
            commit("superadmin/setUsersList", response.data.users_list, { root: true });
            commit("backgrounds/setBackgroundsList", response.data.backgrounds_list, { root: true });
            commit("setMyTemplates", response.data.my_templates);
            commit("setOtherTemplates", response.data.other_templates);
            commit("setSelectedTemplates", response.data.my_templates);
            commit("setCurrentTemplate", response.data.current_template);
        })
    },

    selectTemplates({commit}, templates){
            commit("setSelectedTemplates", templates);
    },
    addTemplate({commit, state}, template_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addTemplate", {
            name: template_form.name,
            user: template_form.user,
            max_matches: template_form.max_matches,
            aspect: template_form.aspect,
        })
        .then(response=>{
            commit("setMyTemplates", response.data.my_templates);
            commit("setOtherTemplates", response.data.other_templates);
            commit("errors/setSuccess", "Predložak uspješno dodan.", { root: true });
            if(state.selectedTemplatesWatcher=="other"){
                commit("setSelectedTemplates", response.data.other_templates);
            }
            else{
                commit("setSelectedTemplates", response.data.my_templates);
            }
            if(state.currentTemplate==null){
                commit("setCurrentTemplate", response.data.current_template);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteTemplate({commit, state}, template){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteTemplate", {
            template_id: template,
        })
        .then(response=>{
            commit("setMyTemplates", response.data.my_templates);
            commit("setOtherTemplates", response.data.other_templates);
            commit("errors/setSuccess", "Predložak izbrisan.", { root: true });
            if(state.selectedTemplatesWatcher=="other"){
                commit("setSelectedTemplates", response.data.other_templates);
            }
            else{
                commit("setSelectedTemplates", response.data.my_templates);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    editTemplate({commit, state}, edit_form){
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
            commit("setMyTemplates", response.data.my_templates);
            commit("setOtherTemplates", response.data.other_templates);
            commit("errors/setSuccess", "Predložak uređen.", { root: true });
            if(state.selectedTemplatesWatcher=="other"){
                commit("setSelectedTemplates", response.data.other_templates);
            }
            else{
                commit("setSelectedTemplates", response.data.my_templates);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    currentTemplate({commit}, template){
        commit("setCurrentTemplate", template);
        router.push({path: "/template"+template.id});
    },

};
const getters={
    selectedTemplates: state => state.selectedTemplates,
    myTemplates: state => state.myTemplates,
    otherTemplates: state => state.otherTemplates,
    currentTemplate: state => state.currentTemplate,
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
