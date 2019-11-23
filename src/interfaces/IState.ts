import Page from '../enums/page';

export default interface IState {
    loggedIn: boolean;
    user: string;
    page: Page;
};
