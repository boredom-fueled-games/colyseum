export class User {
  public '@id': string;

  constructor(
    _id?: string
  ) {
    this['@id'] = _id;
  }
}
