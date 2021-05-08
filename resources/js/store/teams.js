
const state={
    selectedTeamsWatcher: "my",
    selectedTeams: null,
    myTeams: [],
    otherTeams: [],
    teamsList: [],
};
const actions={

    getTeams({commit}){
        axios.get("/api/getTeams")
        .then(response=>{
            commit("setMyTeams", response.data.my_teams);
            commit("setOtherTeams", response.data.other_teams);
            commit("setSelectedTeams", response.data.my_teams);
        })
    },

    selectTeams({commit}, teams){
        commit("setSelectedTeams", teams);
    },
    addTeam({commit, state}, team_form){
        let form = new FormData();
        form.append('title', team_form.title);
        form.append('name', team_form.name);
        form.append('user', team_form.user);
        form.append('logo', team_form.logo);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addTeam", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
        .then(response=>{
            commit("setMyTeams", response.data.my_teams);
            commit("setOtherTeams", response.data.other_teams);
            commit("setTeamsList", response.data.teams_list);
            commit("errors/setSuccess", "Pozadina uspješno dodana.", { root: true });
            if(state.selectedTeamsWatcher=="other"){
                commit("setSelectedTeams", response.data.other_teams);
            }
            else{
                commit("setSelectedTeams", response.data.my_teams);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteTeam({commit, state}, team){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteTeam", {
            team_id: team,
        })
        .then(response=>{
            commit("setMyTeams", response.data.my_teams);
            commit("setOtherTeams", response.data.other_teams);
            commit("errors/setSuccess", "Tim/igrač izbrisan.", { root: true });
            if(state.selectedTeamsWatcher=="other"){
                commit("setSelectedTeams", response.data.other_teams);
            }
            else{
                commit("setSelectedTeams", response.data.my_teams);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

};
const getters={
    selectedTeams: state => state.selectedTeams,
    myTeams: state => state.myTeams,
    otherTeams: state => state.otherTeams,
    teamsList: state => state.teamsList,
};
const mutations={
    setSelectedTeams(state, data) {
        state.selectedTeams=data;
        if(state.selectedTeams==state.otherTeams){
            state.selectedTeamsWatcher="other";
        }
        else{
            state.selectedTeamsWatcher="my";
        }
    },
    setMyTeams(state, data) {
        state.myTeams=data;

    },
    setOtherTeams(state, data) {
        state.otherTeams=data;
    },
    setTeamsList(state, data){
        state.teamsList=data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
