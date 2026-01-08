import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { LayoutService } from '../../../services/layouts.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-moderation-layout',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './moderation-layout.html',
  styleUrl: './moderation-layout.css',
})
export class ModerationLayout {
  layoutService = inject(LayoutService);

}
