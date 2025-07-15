export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "O item não foi encontrado. Tente novamente em breve.");
    this.name = "NotFoundError";
  }
}
