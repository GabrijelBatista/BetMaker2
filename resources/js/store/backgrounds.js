import router from '../router'

const state={
    myBackgrounds: null,
    otherBackgrounds: null,
    currentBackground: null
};
const actions={
    addBackground({commit}, background_form){
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
            commit("errors/setSuccess", "Predložak uspješno dodan.", { root: true });
        })
        .catch((error) => {
            commit("errors/setErrors", "Došlo je do pogreške.", { root: true });
        })
    },

    currentBackground({commit}, background){
        commit("setCurrentBackground", background);
        router.push({path: background.url});
    },

};
const getters={
    myBackgrounds: state => state.myBackgrounds,
    otherBackgrounds: state => state.otherBackgrounds,
    currentBackground: state => state.currentBackground,
};
const mutations={
    setMyBackgrounds(state, data) {
        state.myBackgrounds=data
    },
    setOtherBackgrounds(state, data) {
        state.otherBackgrounds=data
    },
    setCurrentBackground(state, data) {
        state.currentBackground=data
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
