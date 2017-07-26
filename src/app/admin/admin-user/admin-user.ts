export class AdminUser {
  public id?: number;
  public email: string;
  public username: string;
  public password: string;
  public password_confirm: string;
  public logins?: number;
  public last_login?: number;
}
