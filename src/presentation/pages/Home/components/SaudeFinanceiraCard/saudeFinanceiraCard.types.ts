import type { SaudeFinanceiraDto } from "@/domain/models/saudeFinanceiraDto";

export interface SaudeFinanceiraCardProps {
  saudeFinanceira?: SaudeFinanceiraDto;
  isLoading?: boolean;
  title?: string;
}
