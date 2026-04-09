import {Component, inject} from '@angular/core';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import {ProfileCardComponent} from "../../ui";
import {selectFilteredProfiles} from "../../data";
import {Store} from "@ngrx/store";


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store = inject(Store);

  profiles = this.store.selectSignal(selectFilteredProfiles);

  constructor() {}
}
