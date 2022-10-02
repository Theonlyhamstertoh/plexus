export default class Player {
  id: string = crypto.randomUUID();
  username: string;
  constructor(username: string) {
    this.username = username;
  }
}
