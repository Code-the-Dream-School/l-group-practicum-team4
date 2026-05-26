import  type { User } from "../../../shared/models/userModel"
// import { Player } from "../../../shared/models/models";

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // selectedHero: Player | null;
};

export const initialState: AuthState = {
  user: null, 
  token: null, 
  loading: false,
  error: null,
  isAuthenticated: false,

  // selectedHero: null,
}

export type Action =
  | { type: "LOGIN_START"}
  | { type: "LOGIN_SUCCESS"; 
      payload: {
        user: User,
        token: string }
    }

  | { type: "LOGIN_ERROR"; payload: string}
  | { type: "LOGOUT"}
  // | {
  //   type: "SET_SELECTED_HERO";
  //   payload: Player | null;
  // }


export const AuthReducer = (state: AuthState, action: Action): AuthState => {
  switch(action.type){
    case'LOGIN_START':
      return {
        ...state, 
        loading: true, 
        isAuthenticated: false,
        error: null,
      };

    case'LOGIN_SUCCESS':
      return {
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token, 
        isAuthenticated: true
      };

    case'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
    };

    case'LOGOUT':
      return {
        ...initialState,
      }

    default:
      return state;
}
}