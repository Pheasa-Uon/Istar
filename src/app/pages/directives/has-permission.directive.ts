import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeaturePermissionService } from '../service/feature.permission.service';

@Directive({
  selector: '[hasFeaturePermission]'
})
export class HasPermissionDirective {
    // private feature?: string;
    // private action?: 'SEARCH' | 'ADD' | 'VIEW' | 'EDIT' | 'APPROVE' | 'REJECT' | 'DELETED' | 'SAVE' | 'CLEAR' | 'CANCEL' | 'PROCESS' | 'IMPORT' | 'EXPORT';
    // constructor(private tpl: TemplateRef<any>, private viewContainer: ViewContainerRef, private permissionService: FeaturePermissionService) { }
    // @Input('hasPerm') set setConfig(cfg: {feature: string; action: 'SEARCH' | 'ADD' | 'VIEW' | 'EDIT' | 'APPROVE' | 'REJECT' | 'DELETED' | 'SAVE' | 'CLEAR' | 'CANCEL' | 'PROCESS' | 'IMPORT' | 'EXPORT'}){
    //     this.feature = cfg.feature;
    //     this.action = cfg.action;
    //     this.update();
    // }
    // private update(){
    //     this.viewContainer.clear();
    //     if (this.feature && this.action && this.permissionService.has(this.feature, this.action)){
    //         this.viewContainer.createEmbeddedView(this.tpl);
    //     }
    // }

    private feature = ''
    private action: keyof import('../model/permission.model').FeaturePermissionFlags = 'view';

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionService: FeaturePermissionService
    ) { }

    @Input()
    set hasFeaturePermission(value: [string, keyof import('../model/permission.model').FeaturePermissionFlags]) {
        this.feature = value[0];
        this.action = value[1];
        this.updateView();
    }

    private updateView() {
        if (this.permissionService.getPermission(this.feature, this.action)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }else {
            this.viewContainer.clear();
        }
    }
}
