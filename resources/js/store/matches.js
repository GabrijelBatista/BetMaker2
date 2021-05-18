const state={
    selectedMatches: [],
    matches: [],
};
const actions={

    selectMatches({commit}, selected_matches){
        commit("setSelectedMatches", selected_matches)
    },
    addMatch({commit, state}, match_form){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addMatch", {
            all_matches: state.matches,
            home_team: match_form.home_team,
            away_team: match_form.away_team,
            competition: match_form.competition,
            date: match_form.date,
            time: match_form.time,
        })
        .then(response=>{
            commit("errors/setErrors", null, { root: true });
            commit("errors/setSuccess", null, { root: true });
            commit("setMatches", response.data.matches_list);
            commit("errors/setSuccess", "Meč uspješn dodan.", { root: true })
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
            console.log(error);
        })
    },

    deleteMatch({commit, state}, match){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteMatch", {
            match_id: match,
            matches: state.matches,
        })
        .then(response=>{
            console.log(response.data.matches);
            commit("setMatches", response.data.matches);
            commit("errors/setSuccess", "Meč izbrisan.", { root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
            console.log(error);
        })
    },

};
const getters={
    selectedMatches: state => state.selectedMatches,
    matches: state => state.matches,
};
const mutations={
    setSelectedMatches(state, data) {
        state.selectedMatches=data;
    },
    setMatches(state, data) {
        state.matches=data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
