
const state={
    selectedTeamsWatcher: "my",
    selectedTeams: null,
    myTeams: [],
    otherTeams: [],
    teamsList: [],
    paginationDetails: {
        lenght: 0,
        page: 0
    }
};
const actions={

    getTeams({commit, state, dispatch}){
        axios.get("/api/getTeams?page=" + state.paginationDetails.page)
        .then(response=>{
            commit("setMyTeams", response.data.my_teams);
            commit("setOtherTeams", response.data.other_teams);
            if(state.selectedTeamsWatcher=="my"){
                commit("setSelectedTeams", response.data.my_teams);
            }
            else if(state.selectedTeamsWatcher=="other"){
                commit("setSelectedTeams", response.data.other_teams);
            }
        })
        .catch(function(error) {
            if (error.response || error.response.status === 401) {
                dispatch('currentUser/logoutUser', null, { root: true });
        }})
    },

    selectTeams({commit}, teams){
        commit("setSelectedTeams", teams);
    },
    addTeam({commit, dispatch}, team_form){
        let form = new FormData();
        form.append('title', team_form.title);
        form.append('name', team_form.name);
        form.append('user', team_form.user);
        form.append('tags', team_form.tags);
        form.append('logo', team_form.logo);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addTeam", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
            .then(response=>{
                dispatch("getTeams");
                commit("errors/setSuccess", "Tim uspješno dodan.", { root: true });
            })
        .catch((error) => {
           commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteTeam({commit, dispatch}, team){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteTeam", {
            team_id: team,
        })
            .then(response=>{
                dispatch("getTeams");
                commit("errors/setSuccess", "Tim uspješno izbrisan.", { root: true });
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
    paginationDetails: state => state.paginationDetails,
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
        if(data==null){
            state.paginationDetails.page=0;
            state.paginationDetails.lenght=0;
        }
        else{
            state.paginationDetails.page=data.current_page;
            state.paginationDetails.lenght=data.last_page;
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
