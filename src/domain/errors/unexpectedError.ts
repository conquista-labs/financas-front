export class UnexpectedError extends Error {
  constructor(detail?: string) {
    super(detail ?? "Algo de errado aconteceu. Tente novamente em breve.");
    this.name = "UnexpectedError";
  }
}
