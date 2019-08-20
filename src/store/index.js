import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: {
            username: localStorage.getItem('uname'),
            realname: localStorage.getItem('realname')
        }
    },
    mutations: {
        setUserInformation(state, user) {
            state.user = user
        }
    }
})

export default store