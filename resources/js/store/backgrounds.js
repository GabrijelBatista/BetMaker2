import router from '../router'

const state={
    selectedBackgroundsWatcher: "my",
    selectedBackgrounds: [],
    myBackgrounds: [],
    otherBackgrounds: [],
    currentBackground: null,
    backgroundsList: [],
};
const actions={

    getBackgrounds({commit, state}){
        axios.get("/api/getBackgrounds")
        .then(response=>{
            commit("setMyBackgrounds", response.data.my_backgrounds);
            commit("setOtherBackgrounds", response.data.other_backgrounds);
            commit("setSelectedBackgrounds", response.data.my_backgrounds);
            if(state.currentBackground==null){
                commit("setCurrentBackground", response.data.current_background);
            }
        })
    },

    selectBackgrounds({commit}, backgrounds){
        commit("setSelectedBackgrounds", backgrounds);
    },
    addBackground({commit, state}, background_form){
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
            commit("setMyBackgrounds", response.data.my_backgrounds);
            commit("setOtherBackgrounds", response.data.other_backgrounds);
            commit("errors/setSuccess", "Pozadina uspješno dodana.", { root: true });
            if(state.selectedBackgroundsWatcher=="other"){
                commit("setSelectedBackgrounds", response.data.other_backgrounds);
            }
            else{
                commit("setSelectedBackgrounds", response.data.my_backgrounds);
            }
            if(state.currentBackground==null){
                commit("setCurrentBackground", response.data.current_background);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    deleteBackground({commit, state}, background){
        commit("errors/setErrors", null, { root: true });
        commit("errors/setSuccess", null, { root: true });
        axios.post("/api/deleteBackground", {
            background_id: background,
        })
        .then(response=>{
            commit("setMyBackgrounds", response.data.my_backgrounds);
            commit("setOtherBackgrounds", response.data.other_backgrounds);
            commit("errors/setSuccess", "Pozadina izbrisana.", { root: true });
            if(state.selectedBackgroundsWatcher=="other"){
                commit("setSelectedBackgrounds", response.data.other_backgrounds);
            }
            else{
                commit("setSelectedBackgrounds", response.data.my_backgrounds);
            }
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    currentBackground({commit}, background){
        commit("setCurrentBackground", background);
        router.push({path: "/template"+background.url});
    },

};
const getters={
    selectedBackgrounds: state => state.selectedBackgrounds,
    myBackgrounds: state => state.myBackgrounds,
    otherBackgrounds: state => state.otherBackgrounds,
    currentBackground: state => state.currentBackground,
    backgroundsList: state => state.backgroundsList,
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
