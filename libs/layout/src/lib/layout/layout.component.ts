import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from "@tt/profile";
import {SidebarComponent} from "../sidebar/sidebar.component";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  profileService = inject(ProfileService)

  // // Получаем информацию о залогиненном юзере (т.е. обо мне)
  // ngOnInit() {
  //   console.log('ngOnInit')
  //   this.profileService.getMe().subscribe(val => {
  //     console.log(val);
  //   })
  // }
}
