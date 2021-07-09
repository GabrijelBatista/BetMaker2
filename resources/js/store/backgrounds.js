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
                if (error.response.status == 422){
                    commit("errors/setErrors", error.response.data.errors, { root: true });
                 }
                 else{
                     commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
                 }
        }})
    },

    selectBackgrounds({commit}, backgrounds){
        commit("setSelectedBackgrounds", backgrounds);
    },
    addBackground({commit, dispatch}, background_form){
        commit("errors/setLoading", true, { root: true });
        commit("setSelectedBackgroundsWatcher");
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
            commit("errors/setSuccess", "Pozadina uspješno dodana.", { root: true });
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

    deleteBackground({commit, dispatch}, background){
        commit("errors/setLoading", true, { root: true });
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteBackground", {
            background_id: background,
        })
        .then(response=>{
            dispatch("getBackgrounds");
            commit("errors/setSuccess", "Pozadina uspješno izbrisana.", { root: true });
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

    currentBackground({commit}, background){
        commit("setCurrentBackground", background);
        router.push({path: "/"+background.template_url});
    },

};
const getters={
    selectedBackgroundsWatcher: state => state.selectedBackgroundsWatcher,
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
        if(data==null){
            state.paginationDetails.page=0;
            state.paginationDetails.lenght=0;
        }
        else{
            state.paginationDetails.page=data.current_page;
            state.paginationDetails.lenght=data.last_page;
        }
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
    setSelectedBackgroundsWatcher(state){
        state.selectedBackgroundsWatcher="my";
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
