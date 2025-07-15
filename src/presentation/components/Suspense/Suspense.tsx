import { Suspense as SuspenseReact, type SuspenseProps } from "react";

import { Loading } from "@/presentation/components";

const Suspense: React.FC<SuspenseProps> = ({
  children,
  ...props
}: SuspenseProps) => (
  <SuspenseReact {...props} fallback={<Loading isLoading />}>
    {children}
  </SuspenseReact>
);

export default Suspense;
