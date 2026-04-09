import {createSelector} from "@ngrx/store";
import {postFeature} from "./reducer";

export const selectFilteredPosts = createSelector(
  postFeature.selectPosts,
  (posts) => posts
)

// Селектор нужен, чтобы доставать данные из стора. Он открывает
// внутреннюю структуру стора. Удобно, когда одно и то же значение
// в разных местах
