// has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { AuthService } from '../services/API/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  // On crée un signal interne pour stocker les rôles requis
  private requiredRoles = signal<string[]>([]);

  @Input() set appHasRole(roles: string | string[]) {
    // On normalise l'entrée : si c'est une string, on la transforme en tableau
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    this.requiredRoles.set(rolesArray);
  }

  constructor() {
    // L'effet réagit dès que l'utilisateur change OU que les rôles requis changent
    effect(() => {
      const user = this.authService.currentUser();
      const roles = this.requiredRoles();
      
      // Vérification : l'utilisateur a-t-il au moins UN des rôles du tableau ?
      const hasPermission = user && user.roles.some((role: string) => roles.includes(role));

      this.viewContainer.clear();
      if (hasPermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}