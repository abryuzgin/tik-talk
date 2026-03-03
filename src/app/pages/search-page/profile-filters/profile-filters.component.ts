import { Component, inject, OnDestroy } from '@angular/core';
import { ProfileHeaderComponent } from '../../../common-ui/profile-header/profile-header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile.service';
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap((formValue) => {
          return this.profileService.filterProfiles(formValue);
        })
      )
      .subscribe();
  }

  // Убираем "утечку памяти". Когда со страницы поиска уходим на другую страницу, то
  // обработчик еще висит и "слушает", а это не нужно.
  // Помимо строк ниже есть еще строка 17 (implements OnDestroy) и 27 и 30
  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
