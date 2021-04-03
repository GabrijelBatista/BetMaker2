const state={
    selectedMatches: null,
    matches: [],
};
const actions={
    getMatchesResources({commit}){
        axios.get("/api/getMatchesResources")
        .then(response=>{
            commit("teams/setTeamsList", response.data.teams_list, { root: true });
            commit("competitions/setCompetitionsList", response.data.competitions_list, { root: true });
        })
    },

    selectMatches({commit}, matches){
        commit("setSelectedMatches", matches)
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
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
            if(state.selectedMatches==null){
                commit("setSelectedMatches", reponse.data.matches_list[0]);
            }
            commit("errors/setSuccess", "Meč uspješn dodan.", { root: true })
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
