import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MapComponent } from "./map-component/map-component";

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    MapComponent
  ],
  exports: [ MapComponent]
})
export class SharedModule { }