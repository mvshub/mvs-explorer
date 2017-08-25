export default {
  namespace: 'app',

  state: {
    showAuthModal: false,
    authStatus: '0'
  },

  reducers: {
    setAuthModal(state, { showAuthModal }) {
      return { ...state, showAuthModal };
    },
    setAuthStatus(state, { authStatus }) {
      return { ...state, authStatus };
    }
  },

  effects: {
  },

  subscriptions: {}
};
