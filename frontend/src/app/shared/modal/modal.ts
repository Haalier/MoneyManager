import { Component, Input, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-modal',
  imports: [Dialog],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() title!: string;
  isModalVisible = model<boolean>(false);
}
