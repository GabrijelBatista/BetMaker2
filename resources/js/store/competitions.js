

const state={
    selectedCompetitionsWatcher: "my",
    selectedCompetitions: [],
    myCompetitions: [],
    otherCompetitions: [],
    competitionsList: [],
};
const actions={

    getCompetitions({commit}){
        axios.get("/api/getCompetitions")
        .then(response=>{
            commit("setMyCompetitions", response.data.my_competitions);
            commit("setOtherCompetitions", response.data.other_competitions);
            commit("setSelectedCompetitions", response.data.my_competitions);
        })
    },

    selectCompetitions({commit}, competitions){
        commit("setSelectedCompetitions", competitions);
    },
    addCompetition({commit, state}, competition_form){
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
            commit("setMyCompetitions", response.data.my_competitions);
            commit("setOtherCompetitions", response.data.other_competitions);
            commit("setCompetitionsList", response.data.competitions_list);
            commit("errors/setSuccess", "Pozadina uspješno dodana.", { root: true });
            if(state.selectedCompetitionsWatcher=="other"){
                commit("setSelectedCompetitions", response.data.other_competitions);
            }
            else{
                commit("setSelectedCompetitions", response.data.my_competitions);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteCompetition({commit, state}, competition){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteCompetition", {
            competition_id: competition,
        })
        .then(response=>{
            commit("setMyCompetitions", response.data.my_competitions);
            commit("setOtherCompetitions", response.data.other_competitions);
            commit("errors/setSuccess", "Pozadina izbrisana.", { root: true });
            if(state.selectedCompetitionsWatcher=="other"){
                commit("setSelectedCompetitions", response.data.other_competitions);
            }
            else{
                commit("setSelectedCompetitions", response.data.my_competitions);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

};
const getters={
    selectedCompetitions: state => state.selectedCompetitions,
    myCompetitions: state => state.myCompetitions,
    otherCompetitions: state => state.otherCompetitions,
    competitionsList: state => state.competitionsList,
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
    },
    setMyCompetitions(state, data) {
        state.myCompetitions=data;
    },
    setOtherCompetitions(state, data) {
        state.otherCompetitions=data;
    },
    setCompetitionsList(state, data){
        state.competitionsList=data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
