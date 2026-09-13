import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'pm-account',
  templateUrl: './account.component.html'
})
export class AccountComponent {

  public pageTitle = 'Mi cuenta';
  busy = false;

  constructor(private authService: AuthService, private alertService: AlertService) {}

  get username(): string {
    const user = this.authService.currentUser();
    return user ? (user.username || '') : '';
  }

  async deleteAccount() {
    const confirmed = window.confirm(
      'Esta acción es permanente. Se eliminará tu cuenta y no podrás recuperarla. ¿Querés continuar?'
    );
    if (!confirmed) {
      return;
    }
    this.busy = true;
    try {
      await this.authService.deleteAccount();
      this.alertService.success('Tu cuenta fue eliminada permanentemente.');
    } catch (err: any) {
      this.alertService.error(err?.message || 'No se pudo eliminar la cuenta.');
    } finally {
      this.busy = false;
    }
  }
}
