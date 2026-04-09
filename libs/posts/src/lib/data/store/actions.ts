import {createActionGroup, props} from "@ngrx/store";
import {Post, PostCreateDto} from "@tt/data-access";

export const postActions = createActionGroup({
  source: 'post',
  events: {
    'posts loaded': props<{ posts: Post[] }>(),
    'create posts': props<{ payload: PostCreateDto }>(),
    'posts get': props<{ page?: number }>(),
  }
})
