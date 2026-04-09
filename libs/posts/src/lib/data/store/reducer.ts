import { Post } from "@tt/data-access";
import {createFeature, createReducer, on} from "@ngrx/store";
import {postActions} from "./actions";

// Создаем интерфейс стора
export interface PostState {
  posts: Post[],
}
// Задаем начальные значения
export const initialState: PostState = {
  posts: [],
}

// Здесь уже конкретно создает редьюсер
export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,
    // в метод on передаем экшн, который слушает редьюсер, начальное значение и то, что будем класть в стейт
    on(postActions.postsLoaded, (state, payLoad) => {
      return {
        ...state,
        post: payLoad.posts
      }
    })
  )

  // on(postActions.commentsLoaded, (state, // comment: postId)

})
