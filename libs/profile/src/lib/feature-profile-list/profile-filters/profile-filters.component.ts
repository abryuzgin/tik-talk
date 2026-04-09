import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import {Store} from "@ngrx/store";
import {profileActions} from "../../data";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  store = inject(Store)

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;
  searchFilterSub!: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
  }

  saveFilter(value: any) {
    localStorage.setItem("saveFilter", JSON.stringify(value))
  }

  ngOnInit() {
    const saveData = localStorage.getItem("saveFilter");
    if (saveData) {
      this.searchForm.patchValue(JSON.parse(saveData))
    }

    this.searchFilterSub = this.searchForm.valueChanges.subscribe((value) => {
      this.saveFilter(value)
    })
  }

  // Убираем "утечку памяти". Когда со страницы поиска уходим на другую страницу, то
  // обработчик еще висит и "слушает", а это не нужно.
  ngOnDestroy() {
    if (this.searchFormSub) {
      this.searchFormSub.unsubscribe()
    }
    if (this.searchFilterSub) {
      this.searchFilterSub.unsubscribe()
    }
  }
}
