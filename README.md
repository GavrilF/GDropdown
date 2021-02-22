# DropdownProject
This Project purpose is to show dropdown component, `Please check forms-support` if you want to see the version that supports forms.
The Project contains 2 modules but Examples module is only for demo purposes

#### Core Module
* `OptionComponent` => component that shows single option.
* `OptionListComponent` => components that shows a list of OptionComponents.
* `InputFieldComponent`=> Input field that supports `angular forms`.
* `DropdownComponent` => Component that has InputField and PopupDirective `supports angular forms in forms-support branch`.
* `PopupContainer` => 'Singleton' component that is on root level and responds for rendering popup content.
* `PopupDirective` => Communicates with PopupContainer to ensure a proper content rendering.
* `WindowEventsEmitterService` Singleton service that broadcast window events as an observables.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
