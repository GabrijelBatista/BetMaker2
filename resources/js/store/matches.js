const state={
    selectedMatches: [],
    matches: [],
};
const actions={
    getMatches({commit}){
        commit("setMatches", []);
    },
    selectMatches({commit}, selected_matches){
        commit("setSelectedMatches", selected_matches)
    },
    addMatch({commit, state}, match_form){
        commit("errors/setLoading", true, { root: true });
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
            commit("errors/setSuccess", "Meč uspješno dodan.", { root: true });
            commit("errors/setLoading", false, { root: true });
            let data = state.selectedMatches;
            data.push(response.data.matches_list[response.data.matches_list.length-1]);
            commit("setSelectedMatches", data);
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

    deleteMatch({commit, state}, match){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteMatch", {
            match_id: match,
            matches: state.matches,
        })
        .then(response=>{
            commit("setMatches", response.data.matches);
            commit("errors/setSuccess", "Meč izbrisan.", { root: true });
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
    selectedMatches: state => state.selectedMatches,
    matches: state => state.matches,
};
const mutations={
    setSelectedMatches(state, data) {
        if(data==null){
            state.selectedMatches=[];
        }
        else {
            state.selectedMatches = data;
        }
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
