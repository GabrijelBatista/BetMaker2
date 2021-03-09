import router from '../router'

const state={
    myTemplates: null,
    otherTemplates: null,
    currentTemplate: null
};
const actions={
    addTemplate({commit}, template_form){
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
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteTemplate({commit}, template){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteTemplate", {
            template_id: template,
        })
        .then(response=>{
            commit("setMyTemplates", response.data.my_templates);
            commit("setOtherTemplates", response.data.other_templates);
            commit("errors/setSuccess", "Predložak izbrisan.", { root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    editTemplate({commit}, edit_form){
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
            console.log(response.data.template);
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    currentTemplate({commit}, template){
        commit("setCurrentTemplate", template);
        router.push({path: template.url});
    },

};
const getters={
    myTemplates: state => state.myTemplates,
    otherTemplates: state => state.otherTemplates,
    currentTemplate: state => state.currentTemplate,
};
const mutations={
    setMyTemplates(state, data) {
        state.myTemplates=data
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
