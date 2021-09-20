import types from "./types";

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: {},
  error: ""
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
    return {
      ...state,
      loading: true
    }
    case types.AUTHENTICATE_SUCCESS:
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      user: action.payload
    }
    case types.AUTHENTICATE_FAILURE:
    return {
      ...state,
      loading: false,
      isAuthenticated: false,
      user: {},
      error: action.payload
    }
    case types.VERIFY_EMAIL:
    return {
      ...state,
      loading: false,
      user: {
        ...state.user,
        verified: true
      }
    }
    case types.LOGOUT_REQUEST:
    return {
      ...state,
      user: {},
      loading: false,
      isAuthenticated: false,
      error: ""
    }
    case types.CHANGE_PROFILE_IMAGE:
    return {
      ...state,
      user: {
        ...state.user,
        profile_image: action.payload
      }
    }
    case types.STOP_LOADING:
    return {
      ...state,
      loading: false
    }
    default:
    return state;
  }
}

export default reducer;
