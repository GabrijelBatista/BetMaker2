
import router from '../router'

const state={
    user: null,
    admin: false,
    superadmin: false,
    verificationEmail: null,
    verified: true,
};
const actions={

    loginUser({commit}, form){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.get('/sanctum/csrf-cookie')
        .then(response =>
        axios.post("/api/loginUser", {
            email: form.email,
            password: form.password,
            remember: form.remember,
        }))
        .then(response=>{
            if(response.data.user){
                commit("setUser", response.data.user);
                commit("errors/setErrors", null, { root: true });
                commit("errors/setSuccess", "Uspješna prijava.", { root: true });
                if(response.data.user['role_id']==2){
                commit("setAdmin", true);
                commit("setSuperadmin", false);
                }
                else if(response.data.user['role_id']==1){
                    commit("setAdmin", true);
                    commit("setSuperadmin", true);
                }
                else{
                    commit("setAdmin", false);
                    commit("setSuperadmin", false);
                }
                commit("setVerificationEmail", null);
                router.push({path: '/'});
            }
            else{
                if(response.data.error==="Podaci nisu točni.") {
                    commit("errors/setErrors", response.data.error, {root: true});
                    commit("errors/setSuccess", false, {root: true});
                    commit("setVerified", true);
                }
                else {
                    commit("errors/setErrors", response.data.error, {root: true});
                    commit("setVerified", false);
                }
            }
            commit("errors/setLoading", false, { root: true });
        })
        .catch((error) => {
            if (error.status == 422){
                commit("errors/setErrors", error.data.errors, { root: true });
             }
             else{
                 commit("setVerified", true);
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
             commit("errors/setLoading", false, { root: true });
        })
    },

    verification({commit}, form){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/verification", {
            code: form.code,
            email: form.email,
        })
            .then(response=> {
                if(response.data!=""){
                    commit("setVerified", true);
                    commit("errors/setSuccess", "Uspješna verifikacija.", {root: true});
                    commit("errors/setLoading", false, {root: true});
                    router.push({path: '/login'});
                }
                else{
                    commit("errors/setErrors", "Pogrešan kod.", { root: true });
                    commit("errors/setLoading", false, {root: true});
                }
                 commit("errors/setLoading", false, { root: true });
            })
            .catch((error) => {
                if (error.response.status == 422){
                    commit("errors/setErrors", error.response.data.errors, { root: true });
                }
                else{
                    commit("errors/setErrors", "Pogrešan kod.", { root: true });
                }
                commit("errors/setLoading", false, { root: true });
            })
    },

    change_password({commit}, form){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/changePassword", {
            code: form.code,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation
        })
            .then(response=> {
                if(response.data!=""){
                    commit("setVerified", true);
                    commit("errors/setSuccess", "Uspješna promjena lozinke.", {root: true});
                    commit("errors/setLoading", false, {root: true});
                    router.push({path: '/login'});
                }
                else{
                    commit("errors/setErrors", "Pogrešni podaci.", { root: true });
                    commit("errors/setLoading", false, {root: true});
                }
                commit("errors/setLoading", false, { root: true });
            })
            .catch((error) => {
                if (error.response.status == 422){
                    commit("errors/setErrors", error.response.data.errors, { root: true });
                }
                else{
                    commit("errors/setErrors", "Pogrešni podaci.", { root: true });
                }
                commit("errors/setLoading", false, { root: true });
            })
    },

    sendVerificationCodeForPasswordReset({commit}, email){
        commit("setVerificationEmail", email);
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/sendVerificationCode", {
            email: email,
        })
            .then(response=> {
                if(response.data!=""){
                    commit("errors/setSuccess", "Kod je poslan na vašu email adresu.", {root: true});
                    commit("errors/setLoading", false, {root: true});
                    router.push({path: '/password'});
                }
                else{
                    commit("errors/setErrors", "Račun sa upisanom email adresom ne postoji.", { root: true });
                    commit("errors/setLoading", false, {root: true});
                }
                commit("errors/setLoading", false, { root: true });
            })
            .catch((error) => {
                if (error.status == 422){
                    commit("errors/setErrors", error.data.errors, { root: true });
                }
                else{
                    commit("errors/setErrors", "Račun sa upisanom email adresom ne postoji.", { root: true });
                }
                commit("errors/setLoading", false, { root: true });
            })
    },

    sendVerificationCode({commit}, email){
        commit("setVerificationEmail", email);
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/sendVerificationCode", {
            email: email,
        })
            .then(response=> {
                if(response.data!=""){
                    commit("errors/setSuccess", "Kod je poslan na vašu email adresu.", {root: true});
                    commit("errors/setLoading", false, {root: true});
                    router.push({path: '/verification'});
                }
                else{
                    commit("errors/setErrors", "Račun sa upisanom email adresom ne postoji.", { root: true });
                    commit("errors/setLoading", false, {root: true});
                }
                 commit("errors/setLoading", false, { root: true });
            })
            .catch((error) => {
                if (error.status == 422){
                    commit("errors/setErrors", error.data.errors, { root: true });
                }
                else{
                    commit("errors/setErrors", "Račun sa upisanom email adresom ne postoji.", { root: true });
                }
                commit("errors/setLoading", false, { root: true });
            })
    },

    registerUser({commit}, form){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        commit("setVerificationEmail", form.email);
        axios.post("/api/registerUser", {
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
        })
        .then(response=>{
            commit("errors/setSuccess", "Uspješna registracija.", { root: true });
            commit("errors/setLoading", false, { root: true });
            router.push({path: '/verification'});
        })
        .catch((error) => {
            if (error.status == 422){
                commit("errors/setErrors", error.data.errors, { root: true });
             }
             else{
                 commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
             }
             commit("errors/setLoading", false, { root: true });
        })
    },

    logoutUser({commit}){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.get("/api/logoutUser");
            commit("setUser", null);
            commit("templateOptions/setResolution", null, { root: true });
            commit("templateOptions/setTemplateResolutions", null, { root: true });
            commit("matches/setMatches", null, { root: true });
            commit("matches/setSelectedMatches", null, { root: true });
            commit("superadmin/setUsersList", null, { root: true });
            commit("errors/setErrors", null, { root: true });
            commit("templates/setCurrentTemplate", null, { root: true });
            commit("templates/setMyTemplates", null, { root: true });
            commit("templates/setSelectedTemplates", null, { root: true });
            commit("templates/setOtherTemplates", null, { root: true });
            commit("backgrounds/setCurrentBackground", null, { root: true });
            commit("backgrounds/setMyBackgrounds", null, { root: true });
            commit("backgrounds/setSelectedBackgrounds", null, { root: true });
            commit("backgrounds/setOtherBackgrounds", null, { root: true });
            commit("teams/setSelectedTeams", null, { root: true });
            commit("teams/setOtherTeams", null, { root: true });
            commit("teams/setMyTeams", null, { root: true });
            commit("teams/setTeamsList", null, { root: true });
            commit("competitions/setSelectedCompetitions", null, { root: true });
            commit("competitions/setOtherCompetitions", null, { root: true });
            commit("competitions/setMyCompetitions", null, { root: true });
            commit("competitions/setCompetitionsList", null, { root: true });
            commit("superadmin/setRoles", null, { root: true });
            commit("superadmin/setAspects", null, { root: true });
            commit("superadmin/setResolutions", null, { root: true });
            commit("errors/setSuccess", "Uspješno ste se odjavili.", { root: true });
            commit("setAdmin", false);
            commit("setSuperadmin", false);
            commit("setVerificationEmail", null);
            commit("errors/setLoading", false, { root: true });
            commit("setVerified", true);
        router.push({path: '/login'});
    },
};

const getters={
    user: state => state.user,
    admin: state => state.admin,
    superadmin: state => state.superadmin,
    verificationEmail: state => state.verificationEmail,
    verified: state => state.verified,
};
const mutations={
     setVerified(state, data) {
        state.verified=data
    },
    setVerificationEmail(state, data) {
        state.verificationEmail=data
    },
    setUser(state, data) {
        state.user=data
    },
    setAdmin(state, data) {
        state.admin=data
    },
    setSuperadmin(state, data) {
        state.superadmin=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
