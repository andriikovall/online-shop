import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Directive({
  selector: '[roles]',
  inputs: ['roles']
})

export class RolesDirective {

  constructor(private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private userService: AuthService) {

  }

  @Input() set roles(allowedRoles: Array<string>) {
    const userRole: string = this.userService.getUserRole() || 'guest';
    let shouldShow: boolean = !!allowedRoles.find(role => (role || '').toLowerCase() === userRole);
    if (userRole.toLowerCase() === 'admin') {
      shouldShow = true;
    }
    if (shouldShow) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }
}