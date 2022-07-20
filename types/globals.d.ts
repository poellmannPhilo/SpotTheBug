declare global {
  function someFunction(): string;
  var prisma: PrismaClient<
    PrismaClientOptions,
    never,
    RejectOnNotFound | RejectPerOperation | undefined
  >;
}

export {};
