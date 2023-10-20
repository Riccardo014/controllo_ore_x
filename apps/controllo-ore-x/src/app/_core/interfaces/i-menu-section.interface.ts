/**
 * A configuration object that describes a nav-bar section.
 */
export interface IMenuSection {
  /**
   * The label linked to the menu section.
   */
  label: string;
  /**
   * The route that should be linked to this specific menu section. 
   * 
   * @example
   * Component: `Contacts.page.ts` =>
   * Route at which the component is mounted: ` /contacts` =>
   * This property: `contacts`
   */
  routerLink: string;
  /**
   * The icon for the menu section. Should be a google icon. [https://fonts.google.com/icons]
   */
  iconName: string;
}
