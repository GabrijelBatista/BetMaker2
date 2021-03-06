

const state={
    selectedCompetitionsWatcher: "my",
    selectedCompetitions: [],
    myCompetitions: [],
    otherCompetitions: [],
    competitionsList: [],
    paginationDetails: {
        lenght: 0,
        page: 0
    }
};
const actions={

    getCompetitions({commit, state, dispatch}){
        axios.get("/api/getCompetitions?page=" + state.paginationDetails.page)
        .then(response=>{
            commit("setMyCompetitions", response.data.my_competitions);
            commit("setOtherCompetitions", response.data.other_competitions);
            if(state.selectedCompetitionsWatcher=="my"){
                commit("setSelectedCompetitions", response.data.my_competitions);
            }
            else if(state.selectedCompetitionsWatcher=="other"){
                commit("setSelectedCompetitions", response.data.other_competitions);
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

    selectCompetitions({commit}, competitions){
        commit("setSelectedCompetitions", competitions);
    },
    addCompetition({commit, dispatch}, competition_form){
        commit("setSelectedCompetitionsWatcher");
        commit("errors/setLoading", true, { root: true });
        let form = new FormData();
        form.append('title', competition_form.title);
        form.append('name', competition_form.name);
        form.append('user', competition_form.user);
        form.append('logo', competition_form.logo);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addCompetition", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
        .then(response=>{
            dispatch("getCompetitions");
            commit("errors/setSuccess", "Natjecanje uspješno dodano.", { root: true });
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

    deleteCompetition({commit, dispatch}, competition){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteCompetition", {
            competition_id: competition,
        })
        .then(response=>{
            dispatch("getCompetitions");
            commit("errors/setSuccess", "Natjecanje uspješno izbrisano.", { root: true });
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

};
const getters={
    selectedCompetitions: state => state.selectedCompetitions,
    myCompetitions: state => state.myCompetitions,
    otherCompetitions: state => state.otherCompetitions,
    competitionsList: state => state.competitionsList,
    paginationDetails: state => state.paginationDetails,
    selectedCompetitionsWatcher: state => state.selectedCompetitionsWatcher,
};
const mutations={
    setSelectedCompetitions(state, data) {
        state.selectedCompetitions=data;
        if(state.selectedCompetitions==state.otherCompetitions){
            state.selectedCompetitionsWatcher="other";
        }
        else{
            state.selectedCompetitionsWatcher="my";
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
    setMyCompetitions(state, data) {
        state.myCompetitions=data;
    },
    setOtherCompetitions(state, data) {
        state.otherCompetitions=data;
    },
    setCompetitionsList(state, data){
        state.competitionsList=data;
    },
    setSelectedCompetitionsWatcher(state){
        state.selectedCompetitionsWatcher="my";
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
