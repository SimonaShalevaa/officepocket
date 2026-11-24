import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function usePersistedState(key, initialValue) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(key);

        if (storedState !== null) {
          setState(JSON.parse(storedState));
        }
      } catch (error) {
        console.error("Failed to load state from AsyncStorage", error);
      }
    };

    loadState();
  }, [key]);

  const setPersistedState = async (value) => {
    setState(value);

    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save state to AsyncStorage", error);
    }
  };

  return [state, setPersistedState];
}
