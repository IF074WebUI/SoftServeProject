import { SoftServeProjectPage } from './app.po';

describe('soft-serve-project App', () => {
  let page: SoftServeProjectPage;

  beforeEach(() => {
    page = new SoftServeProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
