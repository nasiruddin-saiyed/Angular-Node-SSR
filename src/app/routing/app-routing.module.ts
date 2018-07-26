import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "../shared/layout/layout/layout.component";
import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { HomeComponent } from "../components/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "home",
        component: HomeComponent
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" }
    ]
  },
  { path: "", pathMatch: "full", redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
