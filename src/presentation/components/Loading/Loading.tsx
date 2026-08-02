import "./loading.css";

import React from "react";

import Logo from "@/presentation/assets/images/short_logo.svg?react";

import { type LoadingProps } from "./loading.types";

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      data-testid="loading-spinner"
      className="fixed inset-0 z-[900] flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    >
      <Logo className="logo size-16 text-primary" />
    </div>
  );
};

export default Loading;
