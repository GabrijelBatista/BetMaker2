
import router from '../router'

const state={
    user: null,
    admin: false,
    superadmin: false,
    users_list: null,
};
const actions={

    loginUser({commit}, form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.get('/sanctum/csrf-cookie')
        .then(response =>
        axios.post("/api/loginUser", {
            email: form.email,
            password: form.password,
        }))
        .then(response=>{
            commit("setUsersList", response.data.users_list);
            commit("setUser", response.data.user['email']);
            commit("templates/setCurrentTemplate", response.data.current_template, { root: true });
            commit("templates/setMyTemplates", response.data.my_templates, { root: true });
            commit("templates/setOtherTemplates", response.data.other_templates, { root: true });
            commit("backgrounds/setCurrentBackground", response.data.current_background, { root: true });
            commit("backgrounds/setMyBackgrounds", response.data.my_backgrounds, { root: true });
            commit("backgrounds/setOtherBackgrounds", response.data.other_backgrounds, { root: true });
            commit("superadmin/setRoles", response.data.roles, { root: true });
            commit("superadmin/setResolutions", response.data.resolutions, { root: true });
            commit("superadmin/setAspects", response.data.aspects, { root: true });
            if(response.data.user['email']){
                commit("errors/setErrors", null, { root: true });
                commit("errors/setSuccess", "Uspješna prijava.", { root: true });
            }
            else{
                commit("errors/setErrors", "Došlo je do pogreške", { root: true });
                commit("errors/setSuccess", false, { root: true });
            }
            if(response.data.user['role_id']==2){
                commit("setAdmin", true);
                commit("setSuperadmin", false);
            }
            else if(response.data.user['role_id']==3){
                commit("setAdmin", true);
                commit("setSuperadmin", true);
            }
            else{
                commit("setAdmin", false);
                commit("setSuperadmin", false);
            }
            router.push({path: '/'});
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške", { root: true });
            commit("errors/setSuccess", false, { root: true });
        })
    },

    registerUser({commit}, form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/registerUser", {
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
        })
        .then(response=>{
            commit("errors/setSuccess", "Uspješna registracija.", { root: true });
            router.push({path: '/login'});
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },
    logoutUser({commit}){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.get("/api/logoutUser");
            commit("setUser", null);
            commit("setUsersList", null);
            commit("errors/setErrors", null, { root: true });
            commit("templates/setCurrentTemplate", null, { root: true });
            commit("templates/setMyTemplates", null, { root: true });
            commit("templates/setOtherTemplates", null, { root: true });
            commit("backgrounds/setCurrentBackground", null, { root: true });
            commit("backgrounds/setMyBackgrounds", null, { root: true });
            commit("backgrounds/setOtherBackgrounds", null, { root: true });
            commit("superadmin/setRoles", null, { root: true });
            commit("superadmin/setAspects", null, { root: true });
            commit("superadmin/setResolutions", null, { root: true });
            commit("errors/setSuccess", "Uspješno ste se odjavili.", { root: true });
            commit("setAdmin", false);
            commit("setSuperadmin", false);
            router.push({path: '/login'});
    },

    checkUser({commit}){
        axios.get('api/user')
        .then(response=>{
            commit("setUser", response.data);
        })
        .catch((error) => {
            commit("setUser", null);
            commit("setAdmin", false);
            commit("setSuperadmin", false);
        })
    },
};
const getters={
    user: state => state.user,
    admin: state => state.admin,
    superadmin: state => state.superadmin,
    usersList: state => state.users_list,
};
const mutations={
    setUser(state, data) {
        state.user=data
    },
    setAdmin(state, data) {
        state.admin=data
    },
    setSuperadmin(state, data) {
        state.superadmin=data
    },
    setUsersList(state, data) {
        state.users_list=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
