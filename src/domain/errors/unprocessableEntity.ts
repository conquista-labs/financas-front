export class UnprocessableEntity extends Error {
  constructor(message?: string) {
    super(message ?? "Algo de errado aconteceu. Tente novamente em breve.");
    this.name = "UnprocessableEntity";
  }
}
