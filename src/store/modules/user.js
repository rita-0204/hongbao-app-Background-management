export default {
  namespaced: true,
  state: {
    id: 0,
    name: ''
  },
  mutations: {
    updateType (state, type) {
      state.type = type
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
