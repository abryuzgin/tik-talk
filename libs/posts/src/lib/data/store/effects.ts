import {inject, Injectable} from "@angular/core";
import {PostService} from "@tt/data-access";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {postActions} from "./actions";
import {map, switchMap} from "rxjs";

@Injectable({
  providedIn: "root",
})

export class PostEffects {
  postService = inject(PostService)
  actions$ = inject(Actions)

  createPosts = createEffect(() => {
    return this.actions$.pipe(
      // экшн, на который настроен эффект
      ofType(postActions.postsGet),
      // switchMap дает возможность вызвать сразу метод сервиса
      switchMap(() => {
        // в ответ получаем массив постов
        return this.postService.fetchPosts()
      }),
      // весь массив постов загружаем в стор (диспатчим экшн для загрузки)
      map(posts => postActions.postsLoaded({ posts: posts }))
    )
  })
}
