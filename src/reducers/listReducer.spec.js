import { listReducer, initialListState } from "./listReducer";

describe("listReducer", () => {
  it("starts with loading and an empty list", () => {
    expect(initialListState).toEqual({
      items: [],
      isLoading: true,
      isRefreshing: false,
      error: "",
    });
  });

  it("FETCH_START turns on loading", () => {
    const state = { ...initialListState, isLoading: false };

    const newState = listReducer(state, { type: "FETCH_START" });

    expect(newState.isLoading).toBe(true);
  });

  it("REFRESH_START turns on refreshing and keeps the items", () => {
    const state = {
      ...initialListState,
      items: [{ id: "1" }],
      isLoading: false,
    };

    const newState = listReducer(state, { type: "REFRESH_START" });

    expect(newState.isRefreshing).toBe(true);
    expect(newState.items).toEqual([{ id: "1" }]);
  });

  it("FETCH_SUCCESS saves the items and stops loading and refreshing", () => {
    const state = { ...initialListState, isRefreshing: true, error: "Грешка" };
    const items = [{ id: "1" }, { id: "2" }];

    const newState = listReducer(state, {
      type: "FETCH_SUCCESS",
      payload: items,
    });

    expect(newState.items).toEqual(items);
    expect(newState.isLoading).toBe(false);
    expect(newState.isRefreshing).toBe(false);
    expect(newState.error).toBe("");
  });

  it("FETCH_ERROR saves the error and keeps the old items", () => {
    const state = {
      ...initialListState,
      items: [{ id: "1" }],
      isRefreshing: true,
    };

    const newState = listReducer(state, {
      type: "FETCH_ERROR",
      payload: "Няма интернет",
    });

    expect(newState.error).toBe("Няма интернет");
    expect(newState.items).toEqual([{ id: "1" }]);
    expect(newState.isLoading).toBe(false);
    expect(newState.isRefreshing).toBe(false);
  });

  it("does not change the state for an unknown action", () => {
    const state = { ...initialListState, items: [{ id: "1" }] };

    const newState = listReducer(state, { type: "UNKNOWN" });

    expect(newState).toBe(state);
  });

  it("does not change the old state object", () => {
    const state = { ...initialListState };

    listReducer(state, { type: "FETCH_SUCCESS", payload: [{ id: "1" }] });

    expect(state.items).toEqual([]);
  });
});
