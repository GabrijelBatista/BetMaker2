import router from '../router'

const state={
    selectedBackgroundsWatcher: "my",
    selectedBackgrounds: [],
    myBackgrounds: [],
    otherBackgrounds: [],
    currentBackground: null,
    backgroundsList: [],
    paginationDetails: {
        lenght: 0,
        page: 0
    }
};
const actions={

    getBackgrounds({commit, state, dispatch}){
        axios.get("/api/getBackgrounds?page=" + state.paginationDetails.page)
        .then(response=>{
            commit("setMyBackgrounds", response.data.my_backgrounds);
            commit("setOtherBackgrounds", response.data.other_backgrounds);
            if(state.selectedBackgroundsWatcher=="my"){
                commit("setSelectedBackgrounds", response.data.my_backgrounds);
            }
            else if(state.selectedBackgroundsWatcher=="other"){
                commit("setSelectedBackgrounds", response.data.other_backgrounds);
            }
            if(state.currentBackground==null){
                commit("setCurrentBackground", response.data.current_background);
            }
        })
        .catch(function(error) {
            if (error.response || error.response.status === 401) {
                dispatch('currentUser/logoutUser', null, { root: true });
        }})
    },

    selectBackgrounds({commit}, backgrounds){
        commit("setSelectedBackgrounds", backgrounds);
    },
    addBackground({commit, dispatch}, background_form){
        let form = new FormData();
        form.append('name', background_form.name);
        form.append('user', background_form.user);
        form.append('image', background_form.image);
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/addBackground", form, {
            headers: {
                "Content-Type": "multipart/form-data"
              },
        })
        .then(response=>{
            dispatch("getBackgrounds");
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteBackground({commit, dispatch}, background){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteBackground", {
            background_id: background,
        })
        .then(response=>{
            dispatch("getBackgrounds");
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    currentBackground({commit}, background){
        commit("setCurrentBackground", background);
        router.push({path: "/"+background.template_url});
    },

};
const getters={
    selectedBackgrounds: state => state.selectedBackgrounds,
    myBackgrounds: state => state.myBackgrounds,
    otherBackgrounds: state => state.otherBackgrounds,
    currentBackground: state => state.currentBackground,
    backgroundsList: state => state.backgroundsList,
    paginationDetails: state => state.paginationDetails,
};
const mutations={

    setBackgroundsList(state, data) {
        state.backgroundsList=data;
    },
    setSelectedBackgrounds(state, data) {
        state.selectedBackgrounds=data;
        if(state.selectedBackgrounds==state.otherBackgrounds){
            state.selectedBackgroundsWatcher="other";
        }
        else{
            state.selectedBackgroundsWatcher="my";
        }
        state.paginationDetails.page=data.current_page;
        state.paginationDetails.lenght=data.last_page;
    },
    setMyBackgrounds(state, data) {
        state.myBackgrounds=data;
    },
    setOtherBackgrounds(state, data) {
        state.otherBackgrounds=data;
    },
    setCurrentBackground(state, data) {
        state.currentBackground=data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
