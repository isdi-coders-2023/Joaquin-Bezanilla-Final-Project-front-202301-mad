import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import * as ac from "../reducers/food.action.creator";
import { FoodRepo } from "../services/repositories/food.repo";
import { FoodStructure, ProtoFoodStructure } from "../models/food";
import { newImage } from "../services/firebase/firebase-food";

export function useFood(repo: FoodRepo) {
  const foods = useSelector((state: RootState) => state.foods);
  const dispatch = useDispatch<AppDispatch>();

  const loadFoods = useCallback(
    async (pageChange: number = 0, region: string = "all") => {
      try {
        const data = await repo.loadFoods(pageChange, region);
        dispatch(ac.loadCreator(data.results));
      } catch (error) {
        console.log((error as Error).message);
      }
    },
    [dispatch, repo]
  );

  const loadOneFood = async (foodId: FoodStructure["id"]) => {
    try {
      const foodInfo = await repo.loadSingleFood(foodId);
      dispatch(ac.loadOneCreator(foodInfo.results[0]));
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const addFood = async (food: ProtoFoodStructure, file: File) => {
    try {
      await newImage(food, file);
      const foodToAdd = await repo.createFood(food);
      dispatch(ac.addCreator(foodToAdd.results[0]));
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const editFood = async (
    food: Partial<FoodStructure>,
    file: File,
    formImage: string
  ) => {
    try {
      file ? await newImage(food, file) : (food.img = formImage);
      const foodToEdit = await repo.patchFood(food);
      dispatch(ac.updateCreator(foodToEdit.results[0]));
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const deleteFood = async (foodId: FoodStructure["id"]) => {
    await repo.deleteFood(foodId);
    dispatch(ac.deleteCreator(foodId));
  };
  return { foods, loadFoods, loadOneFood, addFood, editFood, deleteFood };
}
