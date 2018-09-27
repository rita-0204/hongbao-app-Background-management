export default {
  namespaced: true,
  state: {
    classifyList: ''
  },
  mutations: {
    updateList (state, classifyList) {
      state.classifyList = classifyList
    }
  }
}
