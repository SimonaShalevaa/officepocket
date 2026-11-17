export const initialListState = {
  items: [],
  isLoading: true,
  isRefreshing: false,
  error: "",
};

export function listReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true };
    case "REFRESH_START":
      return { ...state, isRefreshing: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        isRefreshing: false,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
